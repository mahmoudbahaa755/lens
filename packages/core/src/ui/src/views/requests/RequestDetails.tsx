import DetailPanel from "../../components/DetailPanel";
import Table from "../../components/Table";
import TabbedDataViewer from "../../components/tabs/TabbedDataViewer";
import type { OneRequest } from "../../types";
import getColumns from "../queries/columns";
import BasicRequestDetails from "./BasicRequestDetails";

const RequestDetails = ({ request }: { request: OneRequest }) => {
  const dynamicTabs = [
    {
      id: "payload",
      label: "Payload",
      data: request.data.body,
    },
    {
      id: "headers",
      label: "Headers",
      data: request.data.headers,
    },
  ];

  const responseTabs = [
    {
      id: "response-body",
      label: "Body",
      data: request.data.response.json,
    },
    {
      id: "response-headers",
      label: "Headers",
      data: request.data.response.headers,
    },
  ];

  const otherDataTabs = [
    {
      id: `Queries`,
      label: `Queries (${request.queries.length})`,
      content: (
        <>
          <div className="flex justify-between items-start rounded-lg mb-4 p-2  ">
            <div>
              <h3 className="text-sm font-semibold mb-1 tracking-wide text-zinc-200">
                Queries
              </h3>
              <span className="text-xs font-medium text-zinc-400">
                ({request.queries.length}) Queries
              </span>
            </div>

            <div className="flex flex-col items-end text-right">
              <span className="text-xs font-semibold mb-1  text-zinc-400 uppercase tracking-wide">
                Duration
              </span>
              <span className="text-sm font-bold text-zinc-100">
                {request.data.totalQueriesDuration}
              </span>
            </div>
          </div>

          <Table data={request?.queries} columns={getColumns()} />
        </>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <BasicRequestDetails request={request} />
      {request.data.user && (
        <DetailPanel
          title="User"
          items={[
            {
              label: "ID",
              value: request?.data?.user?.id,
            },
            {
              label: "Email",
              value: request?.data?.user?.email,
            },
            {
              label: "Name",
              value: request?.data?.user?.name,
            },
          ]}
        />
      )}

      <TabbedDataViewer
        tabs={dynamicTabs}
        title="Request Data"
        defaultActiveTab="payload"
      />
      <TabbedDataViewer
        tabs={responseTabs}
        title="Response Data"
        defaultActiveTab="response-body"
      />
      <TabbedDataViewer tabs={otherDataTabs} defaultActiveTab="Queries" />
    </div>
  );
};

export default RequestDetails;
