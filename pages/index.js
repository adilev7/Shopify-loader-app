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

const Index = () => {
  const [loaders, setLoaders] = useState([
    {
      id: 0,
      loader: require("../images/loader.gif").default,
      chosen: true,
    },
    {
      id: 1,
      loader: require("../images/loader-yellow.gif").default,
      chosen: false,
    },
    {
      id: 2,
      loader: require("../images/loader.gif").default,
      chosen: false,
    },
    {
      id: 3,
      loader: require("../images/loader-yellow.gif").default,
      chosen: false,
    },
  ]);
  // const [files, setFiles] = useState([]);
  // const [chosen, setChosen] = useState({});
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const hasError = rejectedFiles.length > 0;

  const handleChosen = ({ id }) => {
    setLoaders((loaders) =>
      loaders.map((loader) => {
        if (loader.id === id) {
          return { ...loader, chosen: true };
        }

        return { ...loader, chosen: false };
      })
    );
  };

  const handleNew = (acceptedFiles) => {
    if (acceptedFiles.length) {
      const newLoader = {
        id: loaders.length,
        loader: window.URL.createObjectURL(...acceptedFiles),
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

  console.log(loaders);
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
            loaders.map((loader) => {
              return (
                <div
                  onClick={() => handleChosen(loader)}
                  className={loader.chosen ? "is-chosen" : ""}
                  key={loader.id}
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
                    alt={"loader" + loader.id}
                    source={loader.loader}
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
          // onAction: () => {
          //   fetch("https://c20c4a6ac4a9.ngrok.io/hello")
          //     .then((res) => res.json())
          //     .then((data) => console.log(data))
          //     .catch((err) => console.log(err));
          // },
          // loading: true/false
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
