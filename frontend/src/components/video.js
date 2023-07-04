import { Card } from "antd";

export const Video = (props) =>{
    return(
        <>
        <Card title={props.title} style={{width:200,margin:'2em'}} key={props.id}>
            {props.description.substring(10)}
            <br/>
            Timestamp below:
            <br/>
            {Date.parse(props.publishedAt).toLocaleString()}
        </Card>
        </>
    );
}