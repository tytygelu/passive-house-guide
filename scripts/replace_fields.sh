#!/bin/bash

# Get the file path from argument
file_path="$1"

# Extract the article name from the file path (remove extension and path)
article_name=$(basename "$file_path" .mdx)

# Slug, coverImage, and ogImage URL
slug="${article_name}"
coverImage="/images/${article_name}.png"
ogImageUrl="/images/${article_name}.png"

echo "Article name: ${article_name}"
echo "Setting slug to: ${slug}"
echo "Setting coverImage to: ${coverImage}"
echo "Setting ogImage url to: ${ogImageUrl}"

# Replace the fields in all language versions
find "$(dirname "$(dirname "$(dirname "$file_path")")")" -name "${article_name}.mdx" -print0 | while IFS= read -r -d $'\0' file; do
  if [[ -f "$file" ]]; then
    echo "Processing file: $file"
    
    # Replace the slug (assumes slug is on a single line)
    sed -i '' "s|^slug: .*$|slug: \"${slug}\"|g" "$file"
    
    # Replace the coverImage (assumes coverImage is on a single line)
    sed -i '' "s|^coverImage: .*$|coverImage: \"${coverImage}\"|g" "$file"
    
    # Replace ogImage url
    sed -i '' 's|^  url: .*$|  url: "/images/'${article_name}'.png"|' "$file"
  fi
done

echo "Replacement complete."
