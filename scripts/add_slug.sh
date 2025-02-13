#!/bin/bash
# This script adds the slug field to all Breedon files if missing.
# It finds every file named "*.mdx" in src/content
# and, for each that doesn't already have a line starting with "slug:", it inserts one
# immediately after the first line that starts with "title:".

find src/content -type f -name '*.mdx' -print0 | while IFS= read -r -d '' file; do
    echo "Processing $file"
    if ! grep -q '^slug:' "$file"; then
        slug=$(basename "$file" .mdx)
        perl -i -pe "if(/^title: / && !\$x++){ \$_ .= \"slug: \\\"${slug}\\\"\\n\"; }" "$file"
        echo "Slug inserted in $file as ${slug}"
    else
        echo "Slug already exists in $file"
    fi
done
