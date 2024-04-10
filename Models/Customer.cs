using System.ComponentModel.DataAnnotations;

namespace Onboarding_Task.Models
{
    public class Customer
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Address { get; set; }

        public ICollection<Sales> Sales { get; set; }
    }
}
