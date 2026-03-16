const createFolderForm = document.getElementById('createFolderForm');

document.querySelector('.createFolder').addEventListener('click', () => {
  if (createFolderForm.style.display === 'none') {
    createFolderForm.style.display = 'block';
  } else {
    createFolderForm.style.display = 'none';
  }
});
