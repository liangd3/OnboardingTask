using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Onboarding_Task.Models;
using Onboarding_Task.ViewModels;

namespace Onboarding_Task.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly OnboardingTaskDbContext _context;

        public CustomerController(OnboardingTaskDbContext context)
        {
            _context=context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            var customers = await _context.Customers.ToListAsync();
            if (customers == null)
            {
                return NotFound("No customer data");
            }
            return customers;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            if (_context.Customers == null)
            {
                return NotFound("Entity set 'OnboardingTaskDbContext.Customers' is null.");
            }
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
            {
                return NotFound("No customer data for this id");
            }

            return customer;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomer(int id, CreateCustomerRequest customerReq)
        {
            if (customerReq == null)
            {
                return NotFound("Your request is null or invalid");
            }

            if (id != customerReq.Id)
            {
                return NotFound("No customer data for this id");
            }

            try
            {
                _context.Entry(new Customer()
                {
                    Id = customerReq.Id,
                    Address = customerReq.Address,
                    Name = customerReq.Name,
                }).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(id))
                {
                    return NotFound("No customer data for this id");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        [HttpPost]
        public async Task<ActionResult<Customer>> PostCustomer(CreateCustomerRequest customerReq)
        {
            if (customerReq == null)
            {
                return NotFound("Your request is null or invalid");
            }

            if (_context.Customers == null)
            {
                return Problem("Entity set 'OnboardingTaskDbContext.Customers' is null.");
            }
            
            try
            {
                var customer = new Customer() { Name = customerReq.Name, Address = customerReq.Address };
                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetCustomer", new { id = customer.Id }, customer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }

        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            if (_context.Customers == null)
            {
                return NotFound("Entity set 'OnboardingTaskDbContext.Customers' is null.");
            }

            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound("No customer data for this id");
            }

            try 
            { 
                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        private bool CustomerExists(int id)
        {
            return (_context.Customers?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
