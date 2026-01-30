#!/usr/bin/env python3
import os
import re

# Patterns to replace (excluding @/store and @/app)
patterns = [
    (r"from ['\"]@/types", "from '@/app/types"),
    (r"from ['\"]@/utils/", "from '@/app/utils/"),
    (r"from ['\"]@/data/", "from '@/app/data/"),
    (r"from ['\"]@/hooks/", "from '@/app/hooks/"),
    (r"from ['\"]@/components/", "from '@/app/components/"),
    (r"from ['\"]@/contexts/", "from '@/app/contexts/"),
    (r"from ['\"]@/services/", "from '@/app/services/"),
    (r"from ['\"]@/api/", "from '@/app/api/"),
    (r"from ['\"]@/schemas/", "from '@/app/schemas/"),
]

def fix_imports_in_file(filepath):
    """Fix imports in a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        for pattern, replacement in patterns:
            content = re.sub(pattern, replacement, content)
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
    return False

def main():
    """Main function to process all files"""
    fixed_count = 0
    
    # Process all .ts and .tsx files in src/app
    for root, dirs, files in os.walk('/tmp/sandbox/src/app'):
        for file in files:
            if file.endswith(('.ts', '.tsx')):
                filepath = os.path.join(root, file)
                if fix_imports_in_file(filepath):
                    fixed_count += 1
                    print(f"Fixed: {filepath}")
    
    print(f"\nTotal files fixed: {fixed_count}")

if __name__ == '__main__':
    main()
