import sys

filepath = r'c:\Users\Allan\CODE\GAS_N_GO\Frontend\src\components\customer\AuthModal.vue'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix Full Name
content = content.replace(
    '<input v-model="registerForm.fullName" type="text" placeholder="John Doe"',
    '<input v-model="registerForm.fullName" type="text" name="name" autocomplete="name" placeholder="John Doe"'
)

# Fix Email
content = content.replace(
    '<input v-model="registerForm.email" type="email" placeholder="nama@email.com"',
    '<input v-model="registerForm.email" type="email" name="email" autocomplete="email" placeholder="nama@email.com"'
)

# Fix Phone Number
content = content.replace(
    '<input v-model="registerForm.phone" type="tel" placeholder="081234567890"',
    '<input v-model="registerForm.phone" type="tel" name="phone" autocomplete="tel" placeholder="081234567890"'
)

# Fix Password
content = content.replace(
    '<input v-model="registerForm.password" :type="showPassword ? \'text\' : \'password\'" placeholder="Minimum 6 characters"',
    '<input v-model="registerForm.password" :type="showPassword ? \'text\' : \'password\'" name="new-password" autocomplete="new-password" placeholder="Minimum 6 characters"'
)

# Fix Confirm Password
content = content.replace(
    '<input v-model="registerForm.confirmPassword" :type="showPassword ? \'text\' : \'password\'" placeholder="Repeat password"',
    '<input v-model="registerForm.confirmPassword" :type="showPassword ? \'text\' : \'password\'" name="new-password" autocomplete="new-password" placeholder="Repeat password"'
)


with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
