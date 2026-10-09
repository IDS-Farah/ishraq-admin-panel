import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DataListPage from "../../../components/common/DataListPage";
import masterConfig from "../../../config/masterConfig";
import { getApiErrorMessage } from "../../../api/utils/apiHelpers";

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("en-GB");
};

const normalizeRows = (records, config) =>
  records.map((record) => ({
    ...record,
    id: record[config.idField],
    name: record[config.nameField],
    status: record[config.activeField] ? "Active" : "Inactive",
  }));

export default function MasterDataList() {
  const { masterKey } = useParams();
  const navigate = useNavigate();

  const config = masterConfig[masterKey];

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const latestQuery = useRef(null);
  const requestId = useRef(0);

  const loadRows = useCallback(
    async (query, { quiet = false } = {}) => {
      if (!config) return;

      latestQuery.current = query;
      const currentRequest = ++requestId.current;

      if (!quiet) setLoading(true);

      try {
        const response = await config.api.getAll({
          pageNo: query.page,
          pageSize: query.pageSize,
          search: query.search.trim() || undefined,
          isActive:
            query.status === "All" ? undefined : query.status === "Active",
        });

        const result = response?.data?.data;

        if (currentRequest !== requestId.current) return;

        setRows(normalizeRows(result?.data ?? [], config));
        setTotal(result?.totalRecords ?? 0);
      } catch (error) {
        if (currentRequest === requestId.current) {
          setRows([]);
          setTotal(0);
          console.error(getApiErrorMessage(error));
        }
      } finally {
        if (currentRequest === requestId.current && !quiet) {
          setLoading(false);
        }
      }
    },
    [config],
  );

  useEffect(() => {
    if (!config) return;

    const initialQuery = {
      page: 1,
      pageSize: 10,
      search: "",
      status: "All",
    };

    latestQuery.current = initialQuery;
    loadRows(initialQuery);

    return () => {
      // Invalidate pending requests when switching master pages.
      requestId.current += 1;
    };
  }, [masterKey, config, loadRows]);

  const handleQueryChange = useCallback(
    (query) => {
      loadRows(query);
    },
    [loadRows],
  );

  const handleToggleStatus = async (row, nextStatus) => {
    await config.api.toggleActive(row.id);

    const query = latestQuery.current;
    if (query) {
      await loadRows(query, { quiet: true });
    }
  };

  const handleExport = async (query) => {
    const pageSize = 100;
    const firstResponse = await config.api.getAll({
      pageNo: 1,
      pageSize,
      search: query.search.trim() || undefined,
      isActive: query.status === "All" ? undefined : query.status === "Active",
    });

    const firstPage = firstResponse?.data?.data;
    const allRecords = [...(firstPage?.data ?? [])];
    const totalPages = firstPage?.totalPages ?? 1;

    for (let pageNo = 2; pageNo <= totalPages; pageNo += 1) {
      const response = await config.api.getAll({
        pageNo,
        pageSize,
        search: query.search.trim() || undefined,
        isActive:
          query.status === "All" ? undefined : query.status === "Active",
      });

      allRecords.push(...(response?.data?.data?.data ?? []));
    }

    return normalizeRows(allRecords, config);
  };

  if (!config) {
    return (
      <div className="rounded-xl border bg-white p-6">
        Master data configuration not found.
      </div>
    );
  }

  const columns = config.columns.map((column) => ({
    ...column,
    render: (row) => {
      const value = row[column.key];

      if (
        column.key === config.createdAtField ||
        column.key === config.updatedAtField
      ) {
        return formatDate(value);
      }

      return value || "-";
    },
  }));

  const exportConfig = {
    fileName: `${masterKey}.xlsx`,
    sheetName: config.title.slice(0, 31),
    fetchRows: handleExport,
    toRow: (row, index) => ({
      "Sr. No.": index + 1,
      Status: row.status,
      Name: row.name,
      "Created At": formatDate(row[config.createdAtField]),
      "Updated At": formatDate(row[config.updatedAtField]),
    }),
  };

  return (
    <DataListPage
      title={config.title}
      rows={rows}
      total={total}
      loading={loading}
      onQueryChange={handleQueryChange}
      searchPlaceholder={`Search ${config.title.toLowerCase()}...`}
      statusField="status"
      statuses={[
        { value: "Active", tone: "success" },
        { value: "Inactive", tone: "danger" },
      ]}
      activeValue="Active"
      inactiveValue="Inactive"
      columns={columns}
      rowTitle={(row) => row.name}
      entityName={config.singular}
      onAdd={() => navigate(`add`)}
      addLabel={`Add ${config.singular}`}
      onView={(row) => navigate(`${row.id}/view`)}
      onEdit={(row) => navigate(`${row.id}/edit`)}
      onToggleStatus={handleToggleStatus}
      exportConfig={exportConfig}
    />
  );
}
