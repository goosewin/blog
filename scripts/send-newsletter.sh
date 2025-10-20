#!/bin/bash
#
# Send Newsletter Script
# 
# Usage:
#   Automatic mode (GitHub Actions):
#     ./scripts/send-newsletter.sh
#     Detects new posts via git diff and sends newsletter
#
#   Manual mode (send specific posts):
#     ./scripts/send-newsletter.sh slug1 slug2 slug3
#     Sends newsletter for the specified post slugs
#
# Examples:
#   ./scripts/send-newsletter.sh signal-to-noise-crisis-2025
#   ./scripts/send-newsletter.sh post1 post2 post3
#
# Environment variables required:
#   SITE_URL - Your site URL (e.g., https://goosewin.com)
#   NEWSLETTER_SECRET - Secret for API authentication
#

set -e

# Check if manual post slugs were provided as arguments
if [ $# -gt 0 ]; then
  echo "Manual mode: Processing specified posts"
  NEW_POSTS=""
  for slug in "$@"; do
    POST_FILE="posts/${slug}.mdx"
    if [ -f "$POST_FILE" ]; then
      NEW_POSTS="${NEW_POSTS}${POST_FILE}"$'\n'
      echo "  - $slug"
    else
      echo "Warning: Post file not found: $POST_FILE"
    fi
  done
  
  # Remove trailing newline
  NEW_POSTS=$(echo "$NEW_POSTS" | sed '/^$/d')
  
  if [ -z "$NEW_POSTS" ]; then
    echo "Error: No valid post files found"
    exit 1
  fi
else
  echo "Automatic mode: Checking for new blog posts via git"
  # Check for new blog posts using git diff
  NEW_POSTS=$(git diff --name-only --diff-filter=A HEAD~1 HEAD | grep '^posts/.*\.mdx$' || true)
  
  if [ -z "$NEW_POSTS" ]; then
    echo "No new blog posts detected"
    exit 0
  fi
  
  echo "New blog posts detected:"
  echo "$NEW_POSTS"
fi

# Create JSON array of new posts with metadata
POSTS_JSON="["
FIRST=true

for POST_FILE in $NEW_POSTS; do
  if [ "$FIRST" = false ]; then
    POSTS_JSON="${POSTS_JSON},"
  fi
  FIRST=false
  
  # Extract slug from filename
  SLUG=$(basename "$POST_FILE" .mdx)
  
  # Extract metadata from the MDX file
  TITLE=$(grep -E "^\s*title:\s*['\"].*['\"]" "$POST_FILE" | sed -E "s/^\s*title:\s*['\"](.*)['\"]\s*,?\s*$/\1/" | head -1)
  DESCRIPTION=$(grep -E "^\s*description:\s*['\"].*['\"]" "$POST_FILE" | sed -E "s/^\s*description:\s*['\"](.*)['\"]\s*,?\s*$/\1/" | head -1)
  DATE=$(grep -E "^\s*date:\s*['\"].*['\"]" "$POST_FILE" | sed -E "s/^\s*date:\s*['\"](.*)['\"]\s*,?\s*$/\1/" | head -1)
  
  # Escape quotes and backslashes for JSON
  TITLE=$(echo "$TITLE" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g')
  DESCRIPTION=$(echo "$DESCRIPTION" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g')
  
  POSTS_JSON="${POSTS_JSON}{\"title\":\"$TITLE\",\"slug\":\"$SLUG\",\"description\":\"$DESCRIPTION\",\"date\":\"$DATE\"}"
done

POSTS_JSON="${POSTS_JSON}]"

echo "Sending newsletter with posts: $POSTS_JSON"

# Send newsletter via API
curl -X POST "$SITE_URL/api/send-newsletter" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEWSLETTER_SECRET" \
  -d "{\"posts\": $POSTS_JSON}" \
  --fail --silent --show-error

echo "Newsletter sent successfully!"

