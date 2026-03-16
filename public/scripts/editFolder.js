const renameForm = document.getElementById('renameForm');
const deleteForm = document.getElementById('deleteForm');

document.querySelector('.rename').addEventListener('click', () => {
  if (renameForm.style.display === 'none') {
    renameForm.style.display = 'block';
  } else {
    renameForm.style.display = 'none';
  }
});

deleteForm.addEventListener('submit', e => {
  if (!confirm('Are you sure you want to delete this folder?')) {
    e.preventDefault();
  }
});
