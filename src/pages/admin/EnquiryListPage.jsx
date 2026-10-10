import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataListPage from "../../components/common/DataListPage";
import { ENQUIRY_CONFIGS, STATUSES } from "../../config/enquiryConfig";
import { adminEnquiryService } from "../../api/Services/adminEnquiryService";

const toListRow = (item, cfg) => ({
  ...item,
  id: item[cfg.idField],
  status: item[cfg.activeField]
    ? "Active"
    : "Inactive",
});

const EnquiryListPage = ({ formType }) => {
  const cfg = ENQUIRY_CONFIGS[formType];
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await adminEnquiryService.list(
        formType,
        page,
        pageSize,
      );

      setRows(result.data.map((item) => toListRow(item, cfg)));
      setTotalRecords(result.totalRecords);
      setTotalPages(result.totalPages);
    } catch (err) {
      setRows([]);
      setTotalRecords(0);
      setTotalPages(0);
      setError(err?.message || "Unable to load records.");
    } finally {
      setLoading(false);
    }
  }, [formType, cfg, page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggle = async (row, next) => {
    const isActive = next === "Active";

    try {
      await adminEnquiryService.setActive(
        formType,
        row.id,
        isActive,
      );

      setRows((prev) =>
        prev.map((r) =>
          r.id === row.id
            ? {
                ...r,
                [cfg.activeField]: isActive,
                status: next,
              }
            : r,
        ),
      );
    } catch (err) {
      setError(err?.message || "Unable to update status.");
    }
  };

  const categories = useMemo(() => {
    if (!cfg.categoryField) return [];

    return [
      ...new Set(
        rows.map((r) => r[cfg.categoryField]).filter(Boolean),
      ),
    ].sort();
  }, [rows, cfg]);

  const columns = useMemo(
    () =>
      cfg.listColumns.map((c) => ({
        key: c.key,
        label: c.label,
        sortable: c.sortable,
        render: (row) => {
          const value = c.format
            ? c.format(row[c.key], row)
            : row[c.key];

          return value ?? "-";
        },
      })),
    [cfg],
  );

  const toExportRow = (row, index) => ({
    "Sr.No": (page - 1) * pageSize + index + 1,
    ...Object.fromEntries(
      cfg.listColumns.map((c) => [
        c.label,
        c.format
          ? c.format(row[c.key], row)
          : row[c.key] ?? "",
      ]),
    ),
    Status: row.status,
  });

  return (
    <>
      {error && (
        <div className="mb-3 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <span>{error}</span>
          <button
            type="button"
            onClick={load}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      <DataListPage
        title={cfg.title}
        entityName={cfg.entityName}
        rows={rows}
        loading={loading}
        searchPlaceholder={cfg.searchPlaceholder}
        // statuses={STATUSES}
        categories={categories}
        categoryLabel={cfg.categoryLabel}
        categoryField={cfg.categoryField}
        columns={columns}
        rowTitle={(row) => row[cfg.titleField] || "Record"}
        onView={(row) => navigate(`${cfg.detailPath}/${row.id}`)}
        onToggleStatus={undefined}
        exportConfig={{
          fileName: cfg.exportFileName,
          sheetName: cfg.title,
          toRow: toExportRow,
        }}
        pagination={{
          page,
          pageSize,
          totalRecords,
          totalPages,
          onPageChange: setPage,
          onPageSizeChange: (size) => {
            setPageSize(Number(size));
            setPage(1);
          },
        }}
      />
    </>
  );
};

export default EnquiryListPage;