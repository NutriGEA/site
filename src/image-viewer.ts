const backgroundViewer = document.getElementById('background-viewer') as HTMLDialogElement;

backgroundViewer.addEventListener('close', function () {
  this.lastElementChild?.remove();
});

backgroundViewer.addEventListener('keydown', function (evt) {
  if (evt.key === 'Escape') {
    this.close();
  }
});

backgroundViewer.addEventListener('click', function () {
  this.close();
});

function showFullImage(this: HTMLImageElement) {
  const fullId = this.dataset['full']!;
  const template = document.getElementById(fullId) as HTMLTemplateElement;
  backgroundViewer.appendChild(template.content.cloneNode(true));
  backgroundViewer.showModal();
}

document.querySelectorAll<HTMLImageElement>('img[data-full]').forEach(thumb => {
  thumb.addEventListener('click', showFullImage);
});
