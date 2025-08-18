import type { QueryEntry } from "../../types";
import SqlViewer from "./SqlViewer";
import MongbDbViewer from "./MongoViewer";

interface QueryFormatterProps {
  queryPayload: QueryEntry["data"];
}

const QueryViewer = ({ queryPayload }: QueryFormatterProps) => {
  switch (queryPayload.type) {
    case "sql":
      return <SqlViewer sql={queryPayload.query} />;
    case "mongodb":
      return <MongbDbViewer query={queryPayload.query} />;

    default:
      return <pre>{queryPayload.query}</pre>;
  }
};

export default QueryViewer;
