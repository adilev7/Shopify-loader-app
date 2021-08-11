import {
  Page,
  PageActions,
  Thumbnail,
  SkeletonThumbnail,
  Loading,
  DropZone,
  Banner,
  List,
  Frame,
  Toast,
} from "@shopify/polaris";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useState, useCallback, useEffect } from "react";
import gifService from "./services/gifService";
import shopService from "./services/shopService";

const Index = ({ shop }) => {
  const [loaders, setLoaders] = useState([]);
  const [active, setActive] = useState(false);

  /* Toast */
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const toastMarkup = active ? (
    <Toast content="Updated successfully" onDismiss={toggleActive} />
  ) : null;

  const getShopGifs = useCallback(async () => {
    const shopGifs = await gifService.getShopGifs(shop);
    const { data } = await shopService.getShop(shop);

    setLoaders(() => {
      return shopGifs.map((gif) => {
        if (gif._id === data.active_gif) {
          return { ...gif, chosen: true };
        }
        return { ...gif, chosen: false };
      });
    });
  }, [shop, setLoaders]);

  useEffect(() => {
    getShopGifs();
  }, []);
  useEffect(() => {}, [loaders]);

  // const [files, setFiles] = useState([]);
  // const [chosen, setChosen] = useState({});
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const hasError = rejectedFiles.length > 0;

  const handleChosen = async ({ _id: chosenId }) => {
    setLoaders((loaders) => {
      return loaders.map((gif) => {
        if (gif._id === chosenId) {
          return { ...gif, chosen: true };
        }
        return { ...gif, chosen: false };
      });
    });
    await shopService.updateShop({ shop, active_gif: chosenId });
    toggleActive();
  };

  const handleNew = async (acceptedFiles) => {
    const files = [...acceptedFiles];
    if (acceptedFiles.length) {
      let newLoader = {
        file: await base64(files[0]),
        shop,
      };
      try {
        await gifService.createGif(newLoader);
        await getShopGifs();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleDrop = useCallback(
    (_droppedFiles, acceptedFiles, rejectedFiles) => {
      // setFiles((files) => [...files, ...acceptedFiles]);
      setRejectedFiles(rejectedFiles);
    },
    []
  );

  const errorMessage = hasError && (
    <Banner
      title="The following images couldn’t be uploaded:"
      status="critical"
    >
      <List type="bullet">
        {rejectedFiles.map((file, index) => (
          <List.Item key={index}>
            {`"${file.name}" is not supported. File type must be .gif, .jpg, .png or .svg.`}
          </List.Item>
        ))}
      </List>
    </Banner>
  );

  return (
    <Page title="Load Around App">
      <Frame>
        <div className="gifWrap">
          <div className="gifWrapWrap">
            {loaders.length
              ? loaders.map(
                  (loader) =>
                    loader.file && (
                      <div
                        onClick={() => handleChosen(loader)}
                        className={loader.chosen ? "is-chosen" : ""}
                        key={loader._id}
                      >
                        {loader.chosen && (
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            size="lg"
                            style={{
                              color: "rgb(0, 110, 255)",
                              position: "absolute",
                              borderRadius: "100%",
                              backgroundColor: "#fff",
                              zIndex: 1,
                              top: "-9px",
                              right: "-9px",
                            }}
                          />
                        )}
                        <Thumbnail
                          alt={"loader" + loader._id}
                          source={loader.file}
                          size="large"
                        ></Thumbnail>
                      </div>
                    )
                )
              : [...Array(4)].map((val, idx) => (
                  <div key={idx}>
                    <SkeletonThumbnail size="large" fill={true} />
                    <Loading />
                  </div>
                ))}
          </div>
        </div>
        <div className="dropZoneWrap">
          {errorMessage}
          <DropZone
            accept="image/*"
            type="image"
            allowMultiple={false}
            onDrop={(_droppedFiles, acceptedFiles, rejectedFiles) => {
              handleDrop(_droppedFiles, acceptedFiles, rejectedFiles);
              handleNew(acceptedFiles);
            }}
          >
            <DropZone.FileUpload />
          </DropZone>
        </div>
        {toastMarkup}
      </Frame>
    </Page>
  );
};

function base64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      debugger;
      resolve(reader.result);
    };
    reader.onerror = (error) => reject(error);
  });
}

export default Index;
