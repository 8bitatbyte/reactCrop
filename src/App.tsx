import { useState, useEffect } from 'react'
import './App.scss'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import ImageUploading from 'react-images-uploading';

function valuetext(value: number) {
  return `${value}°C`;
}

function App() {
  const [values, setValues] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });
  const [filters, setFilters] = useState({
    grayscale: 0,
    hueRotate: 0,
  });
  const [images, setImages] = useState([]);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0});
  const [orientation, setOrientation] = useState({ isHorizontal: false, isVertical: false });

  useEffect(() => {
    setValues((state) => {
      return {
        ...state,
        ['right']: imageSize.width,
        ['bottom']: imageSize.height,
      }
    })

    const imageDomNode: any = document.querySelector("#clipImage");
      if (imageDomNode?.width) {
        setImageSize({
          width: imageDomNode.width,
          height: imageDomNode.height,
        })
      }
  }, [imageSize.width])

  const handleWindowResize = () => {
    const imageDomNode: any = document.querySelector("#clipImage");
      if (imageDomNode?.width) {
        setImageSize({
          width: imageDomNode.width,
          height: imageDomNode.height,
        })
      }
  }

  useEffect(() => {
    addEventListener('resize', handleWindowResize);
    return () => removeEventListener('resize', handleWindowResize);
  }, []);

  const handleChangeValue = (e: Event) => {
    const target = e.target;
    const { value, name } = target as HTMLInputElement;
    setValues((state) => {
      return {
        ...state,
        [name]: +value
      }
    })
  }

  const handleChangeFilter = (e: Event) => {
    const target = e.target;
    const { value, name } = target as HTMLInputElement;
    setFilters((state) => {
      return {
        ...state,
        [name]: +value
      }
    })
  }

  const onChange = (imageList: any) => {
    if (imageList?.length) {
      // data for submit
    const img = new Image();
    img.onload = function() {
      const _this: any = this;

      if (_this.width >= _this.height) {
        setOrientation({ isHorizontal: true, isVertical: false})
      }

      if (_this.width < _this.height) {
        setOrientation({ isHorizontal: false, isVertical: true})
      }

      setImageSize({
        width: _this.width,
        height: _this.height
      })
    }
    img.src = `${imageList[0].data_url}`;
    setImages(imageList);
    }
  };

  const handleReset = (resetFunc: any) => {
    resetFunc();
    setImageSize({
      width: 0,
      height: 0
    })
    setImages([]);
    setOrientation({ isHorizontal: false, isVertical: false})
  }

  const clip = {
    clip: `rect(${values.top}px, ${values.right}px, ${values.bottom}px, ${values.left}px)`,
    filter: `grayscale(${filters.grayscale}%) hue-rotate(${filters.hueRotate}deg)`,
  }

  return (
    <div className="App">
      <Box>
      <Box sx={{ width: 300 }}>
      <Typography variant="subtitle1" gutterBottom>Clip Rect Editor</Typography>
      <Typography align='left'>top {values.top}</Typography>
      <Slider
        aria-label="top crop"
        disabled={!imageSize.height}
        defaultValue={values.top}
        value={values.top}
        getAriaValueText={valuetext}
        step={imageSize.height ? imageSize.height/20 : 10}
        marks
        min={0}
        max={imageSize.height}
        name="top"
        onChange={(e) => handleChangeValue(e)}
      />
    </Box>

    <Box sx={{ width: 300 }}>
      <Typography align='left'>right {values.right}</Typography>
      <Slider
        aria-label="right top"
        disabled={!imageSize.width}
        defaultValue={values.right}
        value={values.right}
        getAriaValueText={valuetext}
        step={imageSize.width ? imageSize.width/20 : 10}
        marks
        min={0}
        max={imageSize.width}
        name="right"
        onChange={(e) => handleChangeValue(e)}
      />
    </Box>

    <Box sx={{ width: 300 }}>
      <Typography align='left'>bottom {values.bottom}</Typography>
      <Slider
        aria-label="Temperature"
        disabled={!imageSize.height}
        defaultValue={values.bottom}
        value={values.bottom}
        getAriaValueText={valuetext}
        step={imageSize.height ? imageSize.height/20 : 10}
        marks
        min={0}
        max={imageSize.height}
        name="bottom"
        onChange={(e) => handleChangeValue(e)}
      />
    </Box>

    <Box sx={{ width: 300 }}>
      <Typography align='left'>left {values.left}</Typography>
      <Slider
        aria-label="Temperature"
        disabled={!imageSize.width}
        defaultValue={values.left}
        value={values.left}
        getAriaValueText={valuetext}
        step={imageSize.width ? imageSize.width/20 : 10}
        marks
        min={0}
        max={imageSize.width}
        name="left"
        onChange={(e) => handleChangeValue(e)}
      />
    </Box>

    <Box sx={{ width: 300 }}>
    <Typography variant="subtitle1" gutterBottom>Filters Editor</Typography>
    <Typography align='left'>grayscale {filters.grayscale}%</Typography>
    <Slider
        aria-label="Temperature"
        disabled={!imageSize.width}
        defaultValue={filters.grayscale}
        value={filters.grayscale}
        getAriaValueText={valuetext}
        step={10}
        marks
        min={0}
        max={100}
        name="grayscale"
        onChange={(e) => handleChangeFilter(e)}
      />

    <Typography align='left'>hue-rotate {filters.hueRotate}deg</Typography>
    <Slider
        aria-label="Temperature"
        disabled={!imageSize.width}
        defaultValue={filters.hueRotate}
        value={filters.hueRotate}
        getAriaValueText={valuetext}
        step={10}
        marks
        min={0}
        max={360}
        name="hueRotate"
        onChange={(e) => handleChangeFilter(e)}
      />
    </Box>
    </Box>

    <Box sx={{ display: `${!imageSize?.width ? 'grid' : 'block'}`, placeContent: `${!imageSize?.width ? 'center' : ''}`, position: 'relative', width: '50vw', height: '90vh', borderRadius: '10px', backgroundColor: 'white' }}>
    <ImageUploading
        value={images}
        onChange={onChange}
        maxNumber={1}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll
        }) => (
          <>
          {!imageSize?.width && <Button onClick={onImageUpload} variant="contained">Upload</Button>}
          {imageList?.length && <img id="clipImage" className={`${orientation.isHorizontal && "w-full -translate-y-1/2 top-1/2"} ${orientation.isVertical && "h-full -translate-x-1/2 left-1/2"} absolute`} style={clip} src={imageList[0]['data_url']} alt="image to clip" />}
          <Button disabled={images?.length ? false : true}  sx={{ float: `${imageSize?.width ? 'right' : 'unset'}`, margin: `${imageSize?.width ? '1rem' : 'unset'}` }} onClick={() => handleReset(onImageRemoveAll)} variant="contained">Reset</Button>
          </>
        )}
      </ImageUploading>
    </Box>
    </div>
  )
}

export default App
