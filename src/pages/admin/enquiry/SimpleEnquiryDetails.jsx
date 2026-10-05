import EnquiryDetails from "../../../components/form/EnquiryDetails";

const SimpleEnquiryDetails = () => {
  return (
    <EnquiryDetails
      formType="simpleEnquiry"
      apiBase="/api"
      listPath="/admin/simple-enquiry"
    />
  );
};

export default SimpleEnquiryDetails;
