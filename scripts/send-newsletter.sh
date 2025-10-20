#!/bin/bash

set -e

# Check for new blog posts
NEW_POSTS=$(git diff --name-only --diff-filter=A HEAD~1 HEAD | grep '^posts/.*\.mdx$' || true)

if [ -z "$NEW_POSTS" ]; then
  echo "No new blog posts detected"
  exit 0
fi

echo "New blog posts detected:"
echo "$NEW_POSTS"

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

