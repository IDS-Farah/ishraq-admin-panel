import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import DataListPage from "../../../../components/common/DataListPage";
import jobCategoryApi from "../../../../api/Services/jobCategoryApi";
import { getApiErrorMessage } from "../../../../api/utils/apiHelpers";
import dayjs from "dayjs";

/* ----------------------------- CONFIG ----------------------------- */

const config = {
  title: "Job Categories",
  singular: "Job Category",
  api: jobCategoryApi,
  idField: "jC_job_category_id",
  nameField: "jC_name",
  activeField: "jC_is_active",
  createdAtField: "jC_created_at",
  updatedAtField: "jC_updated_at",
  createdByField: "jC_created_by",
  updatedByField: "jC_updated_by",
};

/* --------------------------- DATE HELPERS ------------------------- */

/**
 * Format any date value into dd-mm-yyyy.
 * Accepts: Date | number (epoch) | ISO string | "yyyy-mm-dd" | null/undefined.
 * Returns "-" for invalid/missing values.
 */
const formatDate = (value) => {
  if (!value) return "-";

  const dateString = String(value).trim();

  if (dateString.startsWith("0001-01-01T00:00:00")) {
    return "01-01-2001";
  }

  const date = dayjs(value);

  if (!date.isValid()) return "-";

  return date.format("DD-MM-YYYY");
};

/* ----------------------------- COLUMNS ----------------------------- */

const columns = [
  {
    key: "jC_name",
    label: "Job Category",
    sortable: true,
    render: (row) => row.jC_name || "-",
  },
  {
    key: "jC_job_responsibility",
    label: "Job Responsibility",
    render: (row) => row.jC_job_responsibility || "-",
  },
  {
    key: "jC_created_at",
    label: "Created At",
    sortable: true,
    render: (row) => formatDate(row.jC_created_at),
  },
  {
    key: "jC_updated_at",
    label: "Updated At",
    render: (row) => formatDate(row.jC_updated_at),
  },
];

/* --------------------------- NORMALIZE ---------------------------- */

const normalizeRows = (records) =>
  records.map((record) => ({
    ...record,
    id: record[config.idField],
    name: record[config.nameField],
    status: record[config.activeField] ? "Active" : "Inactive",
  }));

export default function JobCategoryList() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const latestQuery = useRef(null);
  const requestId = useRef(0);

  const loadRows = useCallback(async (query, { quiet = false } = {}) => {
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

      setRows(normalizeRows(result?.data ?? []));
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
  }, []);

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

    return normalizeRows(allRecords);
  };

  const exportConfig = {
    fileName: "jobCategory.xlsx",
    sheetName: config.title.slice(0, 31),
    fetchRows: handleExport,
    toRow: (row, index) => ({
      "Sr. No.": index + 1,
      Status: row.status,
      Name: row.name,
      "Created At": formatDate(row[config.createdAtField]), // dd-mm-yyyy
      "Updated At": formatDate(row[config.updatedAtField]), // dd-mm-yyyy
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
      statusColumnIndex={4}
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
