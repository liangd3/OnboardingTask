using Microsoft.EntityFrameworkCore;

namespace Onboarding_Task.Models
{
    public partial class OnboardingTaskDbContext : DbContext
    {
        public OnboardingTaskDbContext(DbContextOptions<OnboardingTaskDbContext> options) : base(options) { }

        public virtual DbSet<Customer> Customers { get; set; }

        public virtual DbSet<Product> Products { get; set; }

        public virtual DbSet<Sales> Sales { get; set; }

        public virtual DbSet<Store> Stores { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Customer>().ToTable("Customer");
            modelBuilder.Entity<Product>().ToTable("Product");
            modelBuilder.Entity<Sales>().ToTable("Sales");
            modelBuilder.Entity<Store>().ToTable("Store");
        }
        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
