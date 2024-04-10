namespace Onboarding_Task.ResponseViewModels
{
    public class SalesResponse
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public string CustomerName { get; set; }
        public string StoreName { get; set; }
        public int CustomerId { get; set; }
        public int StoreId { get; set; }
        public int ProductId { get; set; }
        public DateTime DateSold { get; set; }
    }
}
