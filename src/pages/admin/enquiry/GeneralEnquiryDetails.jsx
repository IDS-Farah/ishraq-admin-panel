import EnquiryDetails from "../../../components/form/EnquiryDetails";

const GeneralEnquiryDetails = () => {
  return (
    <EnquiryDetails
      formType="generalEnquiry"
      apiBase="/api"
      listPath="/admin/general-enquiry"
    />
  );
};

export default GeneralEnquiryDetails;
