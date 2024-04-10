using System.ComponentModel.DataAnnotations;

namespace Onboarding_Task.ViewModels
{
    public class CreateSalesRequest
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Product is required")]
        [Display(Name = "Product")]
        public int ProductId { get; set; }

        [Required(ErrorMessage = "Customer is required")]
        [Display(Name = "Customer")]
        public int CustomerId { get; set; }

        [Required(ErrorMessage = "Store is required")]
        [Display(Name = "Store")]
        public int StoreId { get; set; }


        [Required(ErrorMessage = "The date sold is required.")]
        [DataType(DataType.Date)]
        [Display(Name = "Date Sold")]
        public DateTime DateSold { get; set; }
    }
}
