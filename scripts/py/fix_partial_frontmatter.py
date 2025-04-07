# fix_partial_frontmatter.py
import os
import glob
import sys

# Define the source file (assumed correct)
source_file_rel = "src/content/principles/en/passive-house-pioneering-energy-efficiency.mdx"
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))) # Get project root
source_file_abs = os.path.join(base_dir, source_file_rel)

# Define the pattern for target files
target_pattern = os.path.join(base_dir, "src/content/principles/*/passive-house-pioneering-energy-efficiency.mdx")

# Define the 1-based line numbers to copy from the source
SOURCE_START_LINE_1_BASED = 8
SOURCE_END_LINE_1_BASED = 12
# Convert to 0-based slice indices
source_slice_start = SOURCE_START_LINE_1_BASED - 1
source_slice_end = SOURCE_END_LINE_1_BASED # slice goes up to, but not including, end index

print(f"Project base directory detected: {base_dir}")
print(f"Source file: {source_file_abs}")
print(f"Target pattern: {target_pattern}")
print(f"Copying lines {SOURCE_START_LINE_1_BASED}-{SOURCE_END_LINE_1_BASED} from source.")

def read_file_lines(file_path):
    """Reads a file and returns a list of its lines."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.readlines()
    except Exception as e:
        print(f"  [Error] Failed to read file {os.path.basename(file_path)}: {e}. Skipping.")
        return None

# --- Main Script Logic ---
print("\nReading source file...")
source_lines = read_file_lines(source_file_abs)

if source_lines is None:
    print("\nFATAL ERROR: Could not read the source file. Aborting.")
    sys.exit(1)

# Extract the specific lines to copy
if len(source_lines) < SOURCE_END_LINE_1_BASED:
     print(f"\nFATAL ERROR: Source file has less than {SOURCE_END_LINE_1_BASED} lines. Cannot extract lines {SOURCE_START_LINE_1_BASED}-{SOURCE_END_LINE_1_BASED}. Aborting.")
     sys.exit(1)

lines_to_copy = source_lines[source_slice_start:source_slice_end]

print("Source lines to copy extracted successfully:")
# print("--- Lines to Copy ---")
# print("".join(lines_to_copy).strip())
# print("---------------------")


print("\nFinding target files...")
target_files = glob.glob(target_pattern)
print(f"Raw glob result: {target_files}") # ADDED THIS LINE FOR DEBUGGING
print(f"Found {len(target_files)} potential target files (including source).")

updated_count = 0
skipped_count = 0

print("\nProcessing target files...")
for target_file_abs in target_files:
    # Skip the source file itself
    if os.path.normpath(target_file_abs) == os.path.normpath(source_file_abs):
        print(f"- Skipping source file: {os.path.relpath(target_file_abs, base_dir)}")
        continue

    print(f"- Processing: {os.path.relpath(target_file_abs, base_dir)}")
    target_lines = read_file_lines(target_file_abs)

    if target_lines is None:
        # Error already printed
        skipped_count += 1
        continue

    # Find the start index in the target file (line containing 'author:')
    # This assumes 'author:' appears around line 8 as in the source
    target_start_index = -1
    potential_start_line = SOURCE_START_LINE_1_BASED - 1 # Check around the expected line
    search_range = 5 # Search a few lines around the expected position

    for i in range(max(0, potential_start_line - search_range), min(len(target_lines), potential_start_line + search_range + 1)):
         # Check for 'author:' at the beginning of the line after stripping leading spaces
        if target_lines[i].strip().startswith('author:'):
            target_start_index = i
            break

    if target_start_index == -1:
        print(f"  [Error] Could not find 'author:' line near expected position in {os.path.basename(target_file_abs)}. Skipping.")
        skipped_count += 1
        continue

    # Check if the target file has enough lines to replace
    num_lines_to_replace = len(lines_to_copy)
    if target_start_index + num_lines_to_replace > len(target_lines):
        print(f"  [Error] Target file {os.path.basename(target_file_abs)} does not have enough lines after 'author:' to replace. Skipping.")
        skipped_count += 1
        continue

    # Construct the new list of lines
    new_target_lines = (
        target_lines[:target_start_index] +  # Lines before the section
        lines_to_copy +                     # The copied lines
        target_lines[target_start_index + num_lines_to_replace:] # Lines after the section
    )

    # Write the modified content back
    try:
        with open(target_file_abs, 'w', encoding='utf-8') as f:
            f.writelines(new_target_lines)
        print(f"  [Success] Lines {SOURCE_START_LINE_1_BASED}-{SOURCE_END_LINE_1_BASED} updated.")
        updated_count += 1
    except Exception as e:
        print(f"  [Error] Failed to write updated content to {os.path.basename(target_file_abs)}: {e}")
        skipped_count += 1


print("\n--- Summary ---")
print(f"Files successfully updated: {updated_count}")
print(f"Files skipped (due to errors or being the source): {skipped_count + 1}") # +1 for source
print("-------------")

if updated_count + skipped_count + 1 != len(target_files):
     print("\nWARNING: The total count doesn't match the number of found files. Please review logs.")

print("\nScript finished.")