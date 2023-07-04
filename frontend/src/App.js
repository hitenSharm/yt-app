import { Button, Col,  Input, Pagination, Row } from "antd";
import { useEffect, useState } from "react";
import { changeCron, fetchVideos, searchVideos } from "./api";
import "./App.css";
import { Video } from "./components/video";

function App() {
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState([]);
  const [sortOrder, setSort] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const searchingVideos = async () => {
    const data = await searchVideos(page, sortOrder,searchQuery);
    setVideos(data);
  };


  useEffect(() => {
    const getAllVideos = async () => {
      let data = [];
      if (searchQuery.length === 0) {
        data = await fetchVideos(page, sortOrder);
        setVideos(data);
      } else {
        searchingVideos();
      }
    };
    getAllVideos();
  }, [page, sortOrder, searchQuery]);

  return (
    <div className="App">
      <Row
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "32px",
        }}
      >
        <Col>
          <Button
            type="primary"
            onClick={() => {
              changeCron("start");
            }}
          >
            Resume Cron
          </Button>
        </Col>

        <Col>
          <Button
            type="primary"
            onClick={() => {
              changeCron("stop");
            }}
          >
            Pause Cron
          </Button>
        </Col>
      </Row>

      <Col>
         <Button onClick={()=>{setSort("asc")}} disabled={sortOrder==="asc"}>Ascending</Button>
         <Button onClick={()=>{setSort("desc")}} disabled={sortOrder==="desc"}>Descending</Button>
        </Col>

      <Row
        style={{
          margin: "2em",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Input
          placeholder="search"
          style={{
            width: 200,
            marginRight: "1em",
          }}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* <Button type='primary' onClick={()=>{searchingVideos()}}>Search</Button> */}
      </Row>

      <Row
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {videos?.length > 0 ? (
          videos.map((video) => {
            return (
              <Video title={video.title} description={video.description} key={video._id} publishedAt={video.publishedAt} />
            );
          })
        ) : (
          <></>
        )}
      </Row>
      <Pagination
        current={page}
        total={50}
        onChange={(val) => {
          setPage(val);
        }}
      />
    </div>
  );
}

export default App;
