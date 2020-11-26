import React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
// import Image from '@ckeditor/ckeditor5-image/src/image';
// import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import { Controller } from 'react-hook-form';

function CKEditorComponent(props) {
  const {
    setValue, name, defaultValue, control, setCampaignEditor, campaignEditor
  } = props;
  return (
    <div>
      <div id={`${name}_toolbar-container`} />
      <Controller
        render={controllerProps => (
          <CKEditor
            editor={DecoupledEditor}
            config={
                {
                  ckfinder: {
                    uploadUrl: '/api/TB_AD/upload'
                  },
                }
            }
            // data="<p>Hello from CKEditor 5!</p>"
            onInit={(editor) => {
              const toolbarContainer = document.querySelector(`#${name}_toolbar-container`);
              toolbarContainer.appendChild(editor.ui.view.toolbar.element);
              setCampaignEditor({ ...campaignEditor, [name]: editor });
              // window[name] = editor;
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setValue(name, data);
            }}
          />
        )}
        defaultValue=""
        name={name}
        control={control}
      />
    </div>
  );
}

export default CKEditorComponent;
