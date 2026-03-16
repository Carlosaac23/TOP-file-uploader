const editFileForm = document.getElementById('editFileForm');
const deleteFileForm = document.getElementById('deleteForm');

document.querySelector('.editBtn').addEventListener('click', () => {
  if (editFileForm.style.display === 'none') {
    editFileForm.style.display = 'block';
  } else {
    editFileForm.style.display = 'none';
  }
});

deleteFileForm.addEventListener('submit', e => {
  if (!confirm('Are you sure you want to delete this file?')) {
    e.preventDefault();
  }
});
