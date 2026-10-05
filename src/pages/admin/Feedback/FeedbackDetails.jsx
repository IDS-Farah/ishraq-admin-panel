import EnquiryDetails from "../../../components/form/EnquiryDetails";

const FeedbackDetails = () => {
  return (
    <EnquiryDetails
      formType="feedback"
      apiBase="/api"
      listPath="/admin/feedback"
    />
  );
};

export default FeedbackDetails;