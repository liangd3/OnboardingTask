using System.ComponentModel.DataAnnotations;

namespace Onboarding_Task.ViewModels
{
    public class CreateProductRequest
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Product name is required")]
        [StringLength(100, MinimumLength = 3)]
        public string Name { get; set; }

        [Required(ErrorMessage = "The price is required.")]
        [Display(Name = "Price")]
        public double Price { get; set; }
    }
}
