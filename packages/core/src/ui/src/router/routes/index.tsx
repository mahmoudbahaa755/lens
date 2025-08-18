import { ArrowRightLeft, Database } from "lucide-react";
import { lazy} from "react";
import { Navigate, type RouteObject } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import type { LensConfig } from "../../types";

const RequestsContainer = lazy(
  () => import("../../containers/requests/RequestsContainer"),
);
const QueriesContainer = lazy(
  () => import("../../containers/queries/QueriesContainer"),
);
const RequestDetailsContainer = lazy(
  () => import("../../containers/requests/RequestDetailsContainer"),
);
const QueryDetailsContainer = lazy(
  () => import("../../containers/queries/QueryDetailsContainer"),
);

export function getRoutesPaths(config: LensConfig) {
  return {
    REQUESTS: `${config.path}/requests`,
    QUERIES: `${config.path}/queries`,
    REQUEST_DETAILS: `${config.path}/requests/:requestId`,
    QUERY_DETAILS: `${config.path}/queries/:queryId`,
  };
}

export function getSidebarRoutes(config: LensConfig) {
  const paths = getRoutesPaths(config);

  return [
    {
      path: paths.REQUESTS,
      label: "Requests",
      icon: ArrowRightLeft,
    },
    {
      path: paths.QUERIES,
      label: "Queries",
      icon: Database,
    },
  ];
}

export function getRoutes(config: LensConfig): RouteObject[] {
  const paths = getRoutesPaths(config);

  return [
    {
      path: "/",
      element: <Navigate to={paths.REQUESTS} replace />,
    },
    {
      path: config.path,
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Navigate to="requests" replace />,
        },
        {
          path: "requests",
          element: <RequestsContainer />,
        },
        {
          path: "requests/:id",
          element: <RequestDetailsContainer />,
        },
        {
          path: "queries",
          element: <QueriesContainer />,
        },
        {
          path: "queries/:id",
          element: <QueryDetailsContainer />,
        },
        {
          path: "*",
          element: <h1>Error</h1>,
        },
      ],
    },
  ];
}
