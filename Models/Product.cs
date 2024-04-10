using System.ComponentModel.DataAnnotations;

namespace Onboarding_Task.Models
{
    public class Product
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public double Price { get; set; }

        public ICollection<Sales> Sales { get; set; }
    }
}

