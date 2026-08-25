import os
import re

files_to_update = [
    r"d:\Doc. Hasmi\CobaWebsite\Imaba-malang\server\controllers\newsController.js",
    r"d:\Doc. Hasmi\CobaWebsite\Imaba-malang\server\controllers\kepengurusanController.js",
    r"d:\Doc. Hasmi\CobaWebsite\Imaba-malang\server\controllers\eventController.js",
    r"d:\Doc. Hasmi\CobaWebsite\Imaba-malang\server\controllers\memberController.js",
    r"d:\Doc. Hasmi\CobaWebsite\Imaba-malang\server\routes\uploadRoutes.js"
]

for file in files_to_update:
    if not os.path.exists(file):
        print(f"Skipping {file} (not found)")
        continue
        
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Common replacements for controllers
    content = content.replace("const { db, bucket } = require('../config/firebase');", "const { db } = require('../config/firebase');\nconst { uploadToCloudinary } = require('../config/cloudinary');")
    
    # In memberController, it was: const { db, bucket } = require('../config/firebase');
    
    # Remove the uploadToFirebase helper entirely from controllers if it exists
    helper_pattern = re.compile(r"async function uploadToFirebase\(file,\s*folder.*?\}.*?return `https://storage.googleapis.com/\$\{bucket.name\}/\$\{uniqueName\}`;[\r\n]+}", re.DOTALL)
    content = helper_pattern.sub("", content)

    # Replace function calls
    content = content.replace("await uploadToFirebase(", "await uploadToCloudinary(req.file.buffer, ")
    
    # Specific for memberController.js (which had custom inline logic instead of helper)
    # memberController had: const fileUpload = bucket.file(uniqueName); ... await fileUpload.save(...)
    if 'memberController.js' in file:
        member_upload_pattern = re.compile(r"const uniqueName = `members/\$\{Date.now\(\)\}-\$\{Math.round\(Math.random\(\) \* 1e9\)\}\$\{path.extname\(req.file.originalname\)\}`;[\s\S]*?photoUrl = `https://storage.googleapis.com/\$\{bucket.name\}/\$\{uniqueName\}`;", re.MULTILINE)
        content = member_upload_pattern.sub("photoUrl = await uploadToCloudinary(req.file.buffer, 'members');", content)

    # Specific for uploadRoutes.js
    if 'uploadRoutes.js' in file:
        content = content.replace("const { bucket } = require('../config/firebase');", "const { uploadToCloudinary } = require('../config/cloudinary');")
        upload_route_pattern = re.compile(r"const uniqueName = `uploads/\$\{Date.now\(\)\}-\$\{Math.round\(Math.random\(\) \* 1e9\)\}\$\{path.extname\(req.file.originalname\)\}`;[\s\S]*?const fileUrl = `https://storage.googleapis.com/\$\{bucket.name\}/\$\{uniqueName\}`;", re.MULTILINE)
        content = upload_route_pattern.sub("const fileUrl = await uploadToCloudinary(req.file.buffer, 'uploads');", content)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Migration to Cloudinary complete!")
