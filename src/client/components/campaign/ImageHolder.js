import React, { useState } from 'react';
import { Divider, Grid } from '@material-ui/core';
import axios from 'axios';
import StyledImage from '../containers/StyledImage';
import { Colors } from '../../lib/Сonstants';
import deleteIcon from '../../img/photo_del.png';
import ConfirmDialog from '../containers/ConfirmDialog';

function ImageHolder(props) {
  const {
    setValue, images, setImages, dbImages, getCampaignData
  } = props;
  const [allSelected, setAllSelected] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageId, setImageId] = useState(0);

  function ImageActionButton(componentProps) {
    const {
      children, color, background, onClick, borderRadius, padding
    } = componentProps;

    const styles = {
      cursor: 'pointer',
      background: background || Colors.blue2,
      color: color || '#ffffff',
      borderRadius: borderRadius || 0,
      fontSize: '14px',
      padding: padding || '3px 16px'
    };

    return (
      <div style={styles} onClick={onClick}>
        {children}
      </div>
    );
  }

  const deleteBtn = {
    width: '26px',
    height: '26px',
    position: 'absolute',
    display: 'inline-block',
    top: '5px',
    right: ' 6px',
    backgroundImage: `url(${deleteIcon})`,
    textIndent: '-10000px',
    cursor: 'pointer'
  };

  function selectImage(id) {
    const imagesArray = images.map((item) => {
      if (item.id === id) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    setImages(imagesArray);
  }

  function selectAll() {
    let imagesArray;
    if (allSelected) {
      imagesArray = images.map(item => ({ ...item, checked: false }));
    } else {
      imagesArray = images.map(item => ({ ...item, checked: true }));
    }
    setImages(imagesArray);
    setAllSelected(!allSelected);
  }

  function addPicture(event) {
    const { files } = event.target;
    setValue('image', files);
    const dateNow = Date.now();

    const imagesArray = Array.from(files).map((item, index) => {
      const picUrl = URL.createObjectURL(item);
      return {
        id: dateNow + item.name,
        file: item,
        url: picUrl,
        checked: false
      };
    });
    setImages(images.concat(imagesArray));
  }

  function deletePicture(id) {
    const filterImages = images.filter(image => image.id !== id);
    setImages(filterImages);
  }

  function deleteDbPicture(id) {
    axios.post('/api/TB_PHOTO_AD/delete', { id }).then((res) => {
      getCampaignData();
    }).catch((err) => {
      alert(err.response.message);
    });
  }

  function deleteSelected() {
    const filterImages = images.filter(image => !image.checked);
    setImages(filterImages);
  }

  return (
    <Grid container spacing={2}>
      {
        dbImages.length > 0 ? (
          <React.Fragment>
            <Grid item xs={12}>
              {
                <Grid container spacing={2}>
                  {dbImages.map(item => (
                    <Grid item key={item.PHO_ID}>
                      <div style={{ position: 'relative' }}>
                        <StyledImage
                          width="130px"
                          height="130px"
                          borderRadius="12px"
                          src={item.PHO_FILE}
                        />
                        <span onClick={() => { setImageId(item.PHO_ID); setDialogOpen(true); }} style={deleteBtn}>button</span>
                      </div>
                    </Grid>
                  ))}
                </Grid>
              }
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </React.Fragment>
        ) : null
      }

      {images.length > 0 ? (
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {images.map(item => (
              <Grid item key={item.id}>
                <div style={{ position: 'relative' }}>
                  <StyledImage
                    width="130px"
                    height="130px"
                    borderRadius="12px"
                    src={item.url}
                  />
                  <span onClick={() => deletePicture(item.id)} style={deleteBtn}>button</span>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => selectImage(item.id)}
                    style={{
                      position: 'absolute',
                      top: '3px',
                      left: '3px'
                    }}
                  />
                </div>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid>
        </Grid>
      ) : null
      }

      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid item>
            <label htmlFor="image">
              <ImageActionButton padding="13px 22px">
                              파일추가
                <input
                  id="image"
                  name="image"
                  type="file"
                  style={{ display: 'none' }}
                  multiple
                  accept="image/*"
                  onChange={(event => addPicture(event))}
                />
              </ImageActionButton>
            </label>
          </Grid>
          {
            images.length > 0 ? (
              <React.Fragment>
                <Grid item>
                  <ImageActionButton onClick={deleteSelected} padding="13px 22px">선택삭제</ImageActionButton>
                </Grid>
                <Grid item>
                  <ImageActionButton onClick={selectAll} padding="13px 22px">모두선택</ImageActionButton>
                </Grid>
              </React.Fragment>
            ) : null
          }
        </Grid>
      </Grid>
      <ConfirmDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        onConfirm={() => { deleteDbPicture(imageId); setImageId(0); }}
        dialogText="삭제하시겠습니까?"
      />
    </Grid>
  );
}

export default ImageHolder;
