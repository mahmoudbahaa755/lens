import DetailPanel from "../../components/DetailPanel";
import TabbedDataViewer from "../../components/tabs/TabbedDataViewer";
import type { OneRequest } from "../../types";
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
    </div>
  );
};

export default RequestDetails;
