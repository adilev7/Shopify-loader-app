import {
  Page,
  PageActions,
  Thumbnail,
  DropZone,
  Banner,
  List,
  Layout,
} from "@shopify/polaris";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useState, useCallback, useEffect } from "react";
import gifService from "./services/gifService";

const Index = ({ shop }) => {
  console.log({ Index: shop });
  const [loaders, setLoaders] = useState([
    {
      _id: 0,
      file: require("../images/loader.gif").default,
      chosen: true,
    },
    {
      _id: 1,
      file: require("../images/loader-yellow.gif").default,
      chosen: false,
    },
    {
      _id: 2,
      file: require("../images/loader.gif").default,
      chosen: false,
    },
    {
      _id: 3,
      file: require("../images/loader-yellow.gif").default,
      chosen: false,
    },
  ]);

  useEffect(() => {
    const getGifs = async () => {
      const { data: shopGifs } = await gifService.getShopGifs(shop);
      shopGifs && setLoaders((loaders) => [...loaders, ...shopGifs]);
      console.log({ shopGifs });
    };
    getGifs();
  }, []);

  // const [files, setFiles] = useState([]);
  // const [chosen, setChosen] = useState({});
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const hasError = rejectedFiles.length > 0;

  const handleChosen = ({ _id: chosenId }) => {
    setLoaders((loaders) =>
      loaders.map((loader) => {
        if (loader._id === chosenId) {
          return { ...loader, chosen: true };
        }

        return { ...loader, chosen: false };
      })
    );
  };

  const handleNew = (acceptedFiles) => {
    if (acceptedFiles.length) {
      const newLoader = {
        _id: loaders.length,
        file: window.URL.createObjectURL(...acceptedFiles),
        chosen: true,
      };

      setLoaders((loaders) => {
        const prevLoaders = loaders.map((loader) => {
          return { ...loader, chosen: false };
        });
        return [...prevLoaders, newLoader];
      });
    }
  };

  const handleDrop = useCallback(
    (_droppedFiles, acceptedFiles, rejectedFiles) => {
      // setFiles((files) => [...files, ...acceptedFiles]);
      setRejectedFiles(rejectedFiles);
    },
    []
  );

  // const fileUpload = !files.length && <DropZone.FileUpload />;
  // const uploadedFiles = files.length > 0 && (
  //   <>
  //     {files.map((file, index) => (
  //       <Thumbnail
  //         key={index}
  //         size="large"
  //         alt={file.name}
  //         source={window.URL.createObjectURL(file)}
  //       />
  //     ))}
  //   </>
  // );

  // const compare = (obj1, obj2) => {
  //   const keys1 = Object.keys(obj1);
  //   const keys2 = Object.keys(obj2);
  //   if (keys1.length !== keys2.length) {
  //     return false;
  //   }
  //   for (let key of keys1) {
  //     if (obj1[key] !== obj2[key]) {
  //       return false;
  //     }
  //   }
  //   return true;
  // };

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
      <div className="gifWrap">
        <div className="gifWrapWrap">
          {loaders.length &&
            loaders.map((loader, index) => {
              console.log(index);
              return (
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
              );
            })}
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
      <PageActions
        primaryAction={{
          content: "Save",
          onAction: () => console.log({ shop }),
          // loading: true / false,
        }}
        secondaryActions={[
          {
            content: "Sync",
            // onAction: () => doSomething(),
            // loading: true/false
          },
        ]}
      />
      {/* </Layout.Section> */}
      {/* </Layout> */}
    </Page>
  );
};

export default Index;
