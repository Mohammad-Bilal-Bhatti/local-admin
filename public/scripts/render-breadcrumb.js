function renderBreadCrumb() {
    const container = document.getElementById('breadcrumb-container');
    if (!container) return;

    const pathname = window.location.pathname;
    function createBreadCrumbItem(label, link, active) {
        return `
        <li class="breadcrumb-item ${active ? 'active' : ''}"> ${active ? label : `<a href=${link}>${label}</a>`}</li>
      `
    }

    const paths = pathname.split('/').map((path, i, all) => {
        if (path === '') return { label: 'Dashboard', path: '/' };

        const base = all.slice(0, i).join('/');
        const label = path.split('-')
                        .map(token => `${token.charAt(0).toUpperCase()}${token.slice(1)}`)
                        .join(' ');


        return { label: label, path: base + '/' + path };
    });


    const items = paths
        .map((item, i, { length }) =>
            createBreadCrumbItem(item.label, item.path, i === length - 1)
        );

    const breadcrumbComponent = `
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          ${items.join('')}
        </ol>
      </nav>
    `;

    container.insertAdjacentHTML('beforeend', breadcrumbComponent);
}

renderBreadCrumb();