using System.ComponentModel.DataAnnotations;

namespace Onboarding_Task.ViewModels
{
    public class CreateStoreRequest
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Store name is required")]
        [StringLength(100, MinimumLength = 3)]
        public string Name { get; set; }

        [Required(ErrorMessage = "Address is required")]
        [StringLength(300)]
        public string Address { get; set; }
    }
}
