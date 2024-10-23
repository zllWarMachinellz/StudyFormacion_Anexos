import './style.css';

const activeProgresBar = (progressBar: HTMLDivElement, i: number) => {
  if (i === 0) 
    progressBar.style.backgroundColor = '#f3e417';

  const progressBarElement = progressBar;
  if (i <= 400) {
    progressBar.style.width = `${i}px`;
    setTimeout(() => {
      i++;
      activeProgresBar(progressBarElement, i);
    }, 15)
  }
  else {
    return;
  }
}

const uploadFile = async (file: File, button: HTMLButtonElement, accesTipe: string) => {

  const evento = button;
  const elementoDiv = evento.parentElement
  const elementoDef = elementoDiv?.parentElement;
  const containerFile = document.querySelector(`#${elementoDef!.id}`);
  const textUrl = document.querySelector<HTMLInputElement>('#textUrl');

  const formData = new FormData();

  formData.append('file', file);
  formData.append('textUrl', textUrl!.value);
  formData.append('accesTipe', accesTipe);
  const res = await fetch('http://192.168.1.170:3000', {
    method: 'POST',
    body: formData
  })

  const { message: result } = await res.json();
  console.log(result)
  if (result === "OK") {
    containerFile?.setAttribute('class', 'completed');
    containerFile?.childNodes.item(2).remove();
  } else{
    containerFile?.setAttribute('class', 'error');
  }
}

const handleInputText = (event: Event) => {
  const { value } = event.target as HTMLInputElement
  const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d{1,5})?(\/[^\s]*)?$/;
  if (value.length === 0) {
    document.querySelector('#span-error')?.remove();
    const labelFiles = document.querySelector('#labelFiles');
    labelFiles?.setAttribute('class', 'hidde-upload');
  }
  else {
    if (value.match(regex)) {
      const labelFiles = document.querySelector('#labelFiles');
      labelFiles?.setAttribute('class', 'fancy-file_text');
    } else {
      if (!document.querySelector('#span-error')) {
        const appContainer = document.querySelector('#app-container');
        const spanError = document.createElement('span');
        spanError.setAttribute('id', 'span-error');
        spanError.textContent = 'Url inválida'
        appContainer?.appendChild(spanError);
      }
      const labelFiles = document.querySelector('#labelFiles');
      labelFiles?.setAttribute('class', 'hidde-upload');
    }
  }
}

const handleFile = (event: Event) => {

  const input = event.target as HTMLInputElement
  const appContainer = document.querySelector('#app-container');
  if (input.files) {
    const files = input.files;
    const label = document.querySelector('.fancy-file_text');
    const deletAllButton = document.createElement('button');
    const uploadContainer = document.querySelector<HTMLDivElement>('#uploadContainer');
    const imgUploads = document.querySelector<HTMLImageElement>('.img-uploads');
    const spanSeleccionar = document.querySelector<HTMLSpanElement>('#span-seleccionar');
    const procAllButton = document.createElement('button');

    deletAllButton.type = 'button';
    deletAllButton.setAttribute('id', 'delete-all-button');
    deletAllButton.textContent = 'Borrar todo';
    procAllButton.textContent = 'Procesar todo';
    appContainer?.appendChild(deletAllButton);
    procAllButton.setAttribute('id', 'proc-all-button');
    appContainer?.appendChild(procAllButton);

    label?.addEventListener('click', (e: Event) => {
      if (document.querySelector('#delete-all-button')) {
        e.preventDefault();
      }
    })


    imgUploads?.remove();
    spanSeleccionar?.remove();
    uploadContainer?.removeAttribute('class');

    const container = document.querySelector('#filesContainer');
    Array.from(files).forEach((key, value) => {

      const select = document.createElement('select');
      const optionClean = document.createElement('option');
      const optionPpc = document.createElement('option');
      const optionExempt = document.createElement('option');
      const div = document.createElement('div');
      const button = document.createElement('button');
      const spanSize = document.createElement('span');
      const delButton = document.createElement('button');
      const divButtons = document.createElement('div');
      const imgButton = document.createElement('img');
      const divProgresBar = document.createElement('div');

      button.type = 'button';

      const span = document.createElement('span');
      container?.appendChild(div);

      divProgresBar.setAttribute('id', `div-progress-bar-${value}`);
      imgButton.setAttribute('src', '/borrar.png');
      select.setAttribute('id', `select-${value}`);
      button.setAttribute('id', `button-file-${value}`);
      optionClean.setAttribute('value', '0');
      optionPpc.setAttribute('value', '1');
      optionExempt.setAttribute('value', '2');
      imgButton.setAttribute('id', 'delete-button');
      div.setAttribute('id', `div-file-${value}`);
      div.setAttribute('class', `div-file`);
      divButtons.setAttribute('id', `div-file-buttons`);
      divProgresBar.style.width = '0px';
      divProgresBar.style.borderRadius = '6px'
      divProgresBar.style.height = '1px';
      optionClean.textContent = '-';
      optionPpc.textContent = 'PPC';
      optionExempt.textContent = 'Exempt';
      span.textContent = key.name;
      spanSize.textContent = `${(key.size / (1024 * 1024)).toFixed(2).toString()} Mbs`;
      button.textContent = 'Procesar';
      uploadContainer?.appendChild(div);
      div.appendChild(span);
      div.appendChild(spanSize);
      div.appendChild(divButtons);
      divButtons.appendChild(button);
      divButtons.appendChild(delButton);
      delButton.appendChild(imgButton);
      divButtons.appendChild(select);
      select.appendChild(optionClean);
      select.appendChild(optionPpc);
      select.appendChild(optionExempt);
      uploadContainer?.appendChild(divProgresBar);
      delButton.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const divElement = document.querySelector(`#div-file-${value}`);

        divElement?.remove();
        if (uploadContainer?.children.length === 0) {
          const imgUpload = document.createElement('img');
          const spanUpload = document.createElement('span');

          imgUpload.setAttribute('src', '/subir.png');
          imgUpload.setAttribute('class', 'img-uploads');
          spanUpload.setAttribute('id', 'span-seleccionar');
          spanUpload.textContent = 'Archivos a seleccionar';
          uploadContainer?.appendChild(imgUpload);
          uploadContainer?.appendChild(spanUpload);
          document.querySelector<HTMLInputElement>('#files')!.value = '';
          uploadContainer?.setAttribute('class', 'upload-container');
          document.querySelector<HTMLButtonElement>('#delete-all-button')?.remove();
        }
      })
      button?.addEventListener('click', async (e: Event) => {
        button.setAttribute('disabled','true');
        const accesTipe = document.querySelector(`#select-${value}`) as HTMLSelectElement;
        const selectValue = accesTipe.value;
        activeProgresBar(divProgresBar, 0);
        await uploadFile(key, e.target as HTMLButtonElement, selectValue);
        divProgresBar.remove();
      });
    })

    deletAllButton.addEventListener('click', (e: Event) => {
      e.preventDefault();
      uploadContainer!.innerHTML = '';
      const imgUpload = document.createElement('img');
      const spanUpload = document.createElement('span');

      imgUpload.setAttribute('src', '/subir.png');
      imgUpload.setAttribute('class', 'img-uploads');
      spanUpload.setAttribute('id', 'span-seleccionar');
      spanUpload.textContent = 'Archivos a seleccionar';
      uploadContainer?.appendChild(imgUpload);
      uploadContainer?.appendChild(spanUpload);
      document.querySelector<HTMLInputElement>('#files')!.value = '';
      uploadContainer?.setAttribute('class', 'upload-container');
      deletAllButton.remove();
      procAllButton.remove();
    });

    procAllButton.addEventListener('click', async (e: Event) => {
      <HTMLButtonElement>e.target 
      for (const [value, key] of Array.from(files).entries()) {
        const select = document.querySelector(`#select-${value}`) as HTMLSelectElement;
        const button = document.querySelector(`#button-file-${value}`) as HTMLButtonElement;
        const progresBar = document.querySelector(`#div-progress-bar-${value}`) as HTMLDivElement;
        if(!button || button.getAttribute('disabled')) continue;
        const selectValue = select.value;
        activeProgresBar(progresBar, 0);
        button.setAttribute('disabled', 'true');
        await uploadFile(key, button, selectValue);
        progresBar.remove();

      }
    });
  }
}

const app = document.querySelector<HTMLDivElement>('#app');


app!.innerHTML = `
  <div id="app-container">
      <h1>Subir Anexos</h1>
      <input type="text" id="textUrl" placeholder="Url del grupo para añadir los participantes" class="text-url">
      <label for="files" class="fancy-file_text" id="labelFiles">
      <div class="upload-container" id="uploadContainer">
        <img src="/subir.png" class="img-uploads">
        <span id='span-seleccionar'>Archivos a seleccionar</span>
      </div>
      <div class="files-container" id="filesContainer">
      </div>
    </label>
    <input type="file" id="files" class="fancy-file" accept=".pdf" multiple>
    <h3>Powered by: Jesus</h3> 
  </div>
`
const textUrl = document.querySelector<HTMLInputElement>('#textUrl');

app?.addEventListener('change', handleFile);
textUrl?.addEventListener('input', handleInputText);

document.querySelector('#labelFiles')?.setAttribute('class', 'hidde-upload');