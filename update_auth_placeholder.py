import sys

filepath = r'c:\Users\Allan\CODE\GAS_N_GO\Frontend\src\components\customer\AuthModal.vue'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace placeholder="08123456789" with placeholder="081234567890"
old_placeholder = 'placeholder="08123456789"'
new_placeholder = 'placeholder="081234567890"'
content = content.replace(old_placeholder, new_placeholder)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
