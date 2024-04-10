using System.ComponentModel.DataAnnotations;

namespace Onboarding_Task.ViewModels
{
    public class CreateCustomerRequest
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Customer name is required")]
        [StringLength(100, MinimumLength = 3)]
        public string Name { get; set; }

        [Required(ErrorMessage = "Address is required")]
        [StringLength(300)]
        public string Address { get; set; }
    }
}
