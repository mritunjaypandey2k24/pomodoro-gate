import os
import zipfile

def create_zip(source_dir, output_path):
    with zipfile.ZipFile(output_path, 'w', compression=zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            for file in files:
                file_path = os.path.join(root, file)
                # Store relative to parent of source_dir so the root folder inside zip is 'GATEChrono-Android'
                archive_name = os.path.relpath(file_path, os.path.dirname(source_dir))
                zipf.write(file_path, archive_name)
                print(f"Added: {archive_name}")
    print(f"Zip created successfully at {output_path} (Size: {os.path.getsize(output_path)} bytes)")

if __name__ == '__main__':
    create_zip('android', 'public/gate-chrono-compose-project.zip')
    # Also copy to dist if dist exists
    if os.path.exists('dist'):
        create_zip('android', 'dist/gate-chrono-compose-project.zip')
