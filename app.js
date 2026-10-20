const routes = document.querySelectorAll('[data-route]');

for (const route of routes) {
  const button = route.querySelector('.transport');
  const description = route.dataset.route === 'microphone' ? 'microphone' : 'incoming';
  button.addEventListener('click', () => {
    const enabled = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(enabled));
    button.setAttribute('aria-label', `Turn ${enabled ? 'off' : 'on'} ${description} noise reduction in the preview`);
    button.classList.toggle('is-on', enabled);
    route.classList.toggle('is-off', !enabled);
    route.querySelector('.route-status').classList.toggle('is-on', enabled);
    route.querySelector('[data-status-text]').textContent = enabled ? 'On' : 'Off';
    route.querySelector('[data-button-text]').textContent = `Turn ${enabled ? 'off' : 'on'} OpenKrisp`;
    route.querySelector('[data-processing-text]').textContent = enabled ? 'Reducing the noise' : 'Noise reduction off';
    route.querySelector('[data-filter-image]').src = enabled ? './assets/filter.svg' : './assets/filter-off.svg';
  });
}

const helpDialog = document.querySelector('#help-dialog');
document.querySelector('#preview-help').addEventListener('click', () => helpDialog.showModal());
document.querySelector('#close-help').addEventListener('click', () => helpDialog.close());
document.querySelector('#help-download').addEventListener('click', () => helpDialog.close());
helpDialog.addEventListener('click', (event) => {
  const rect = helpDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
    helpDialog.close();
  }
});
