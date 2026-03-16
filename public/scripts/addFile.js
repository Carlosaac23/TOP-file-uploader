const addFileForm = document.getElementById('addFileForm');

document.querySelector('.addFile').addEventListener('click', () => {
  if (addFileForm.style.display === 'none') {
    addFileForm.style.display = 'block';
  } else {
    addFileForm.style.display = 'none';
  }
});

document.getElementById('file').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;

  document.getElementById('fileName').textContent = file.name;
  document.getElementById('fileSize').textContent = (file.size / 1024).toFixed(2) + ' KB';
  document.getElementById('fileType').textContent = file.type;
  document.getElementById('fileInfo').style.display = 'block';
});
