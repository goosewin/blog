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

# Load environment variables from .env file if it exists
if [ -f .env.local ]; then
  echo "Loading environment variables from .env.local"
  set -a
  source .env.local
  set +a
elif [ -f .env ]; then
  echo "Loading environment variables from .env"
  set -a
  source .env
  set +a
fi

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
  
  # Extract metadata from the MDX file (handle multi-line values and escaped quotes)
  TITLE=$(grep "title:" "$POST_FILE" | head -1 | sed -E "s/.*title:[[:space:]]*['\"](.+)['\"].*/\1/")
  DATE=$(grep "date:" "$POST_FILE" | head -1 | sed -E "s/.*date:[[:space:]]*['\"](.+)['\"].*/\1/")
  
  # Extract description (may span multiple lines)
  DESCRIPTION=$(sed -n '/description:/,/[;}]/p' "$POST_FILE" | sed -n '/description:/,$p' | sed -E "s/.*description:[[:space:]]*['\"](.+)['\"].*/\1/" | head -1 | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')
  
  # Extract image from metadata (if exists)
  IMAGE=$(grep "image:" "$POST_FILE" | head -1 | sed -E 's/.*["'\'']([^"'\'']+)["'\''].*/\1/' || echo "")
  
  # Build individual post JSON using jq (handles all escaping automatically)
  if [ -n "$IMAGE" ]; then
    POST_OBJ=$(jq -n \
      --arg title "$TITLE" \
      --arg slug "$SLUG" \
      --arg description "$DESCRIPTION" \
      --arg date "$DATE" \
      --arg image "$IMAGE" \
      '{title: $title, slug: $slug, description: $description, date: $date, image: $image}')
  else
    POST_OBJ=$(jq -n \
      --arg title "$TITLE" \
      --arg slug "$SLUG" \
      --arg description "$DESCRIPTION" \
      --arg date "$DATE" \
      '{title: $title, slug: $slug, description: $description, date: $date}')
  fi
  
  # Append to array
  if [ "$FIRST" = false ]; then
    POSTS_JSON="${POSTS_JSON},${POST_OBJ}"
  else
    POSTS_JSON="${POSTS_JSON}${POST_OBJ}"
  fi
done

POSTS_JSON="${POSTS_JSON}]"

echo "Sending newsletter with posts: $POSTS_JSON"
echo "API URL: $SITE_URL/api/send-newsletter"

# Build full payload with jq
PAYLOAD=$(echo "$POSTS_JSON" | jq -c '{posts: .}')

# Send newsletter via API
RESPONSE=$(curl -L -X POST "$SITE_URL/api/send-newsletter" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEWSLETTER_SECRET" \
  -d "$PAYLOAD" \
  -w "\nHTTP_CODE:%{http_code}" \
  -s)

HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')

echo "Response code: $HTTP_CODE"
echo "Response body: $BODY"

if [ "$HTTP_CODE" = "200" ]; then
  echo "Newsletter sent successfully!"
else
  echo "Error: Newsletter sending failed with code $HTTP_CODE"
  exit 1
fi

