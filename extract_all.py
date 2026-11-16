import re
from html.parser import HTMLParser

with open('d:/GM/final.html', 'r', encoding='utf-8') as f:
    content = f.read()

class CodeExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_highlight = False
        self.in_pre = False
        self.cells = []
        self.current_text = []
        self.tag_stack = []
        
    def handle_starttag(self, tag, attrs):
        self.tag_stack.append(tag)
        attrs_dict = dict(attrs)
        cls = attrs_dict.get('class', '')
        if 'highlight' in cls:
            self.in_highlight = True
        if tag == 'pre' and self.in_highlight:
            self.in_pre = True
            self.current_text = []
            
    def handle_endtag(self, tag):
        if self.tag_stack and self.tag_stack[-1] == tag:
            self.tag_stack.pop()
        if tag == 'pre' and self.in_pre:
            self.in_pre = False
            self.in_highlight = False
            if self.current_text:
                self.cells.append(''.join(self.current_text))
                
    def handle_data(self, data):
        if self.in_pre:
            self.current_text.append(data)

extractor = CodeExtractor()
extractor.feed(content)

# Write all cells to a file
with open('d:/GM/all_cells.py', 'w', encoding='utf-8') as f:
    for i, cell in enumerate(extractor.cells):
        f.write(f'# ===== CELL {i+1} =====\n')
        f.write(cell)
        f.write('\n\n')

print(f'Extracted {len(extractor.cells)} cells to all_cells.py')

# Print cell summaries
for i, cell in enumerate(extractor.cells):
    first_line = cell.strip().split('\n')[0][:100]
    print(f'Cell {i+1:3d}: {first_line}')
