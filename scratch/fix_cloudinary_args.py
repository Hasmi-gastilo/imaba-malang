import os

files_to_update = [
    r"d:\Doc. Hasmi\CobaWebsite\Imaba-malang\server\controllers\newsController.js",
    r"d:\Doc. Hasmi\CobaWebsite\Imaba-malang\server\controllers\kepengurusanController.js",
    r"d:\Doc. Hasmi\CobaWebsite\Imaba-malang\server\controllers\eventController.js"
]

for file in files_to_update:
    if not os.path.exists(file):
        continue
        
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix the args
    content = content.replace("await uploadToCloudinary(req.file.buffer, req.file, ", "await uploadToCloudinary(req.file.buffer, ")
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Fixed args!")
