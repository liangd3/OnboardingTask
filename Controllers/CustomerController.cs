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
        public async Task<ActionResult<IEnumerable<Customer>>> AsyncGetCustomers()
        {
            try {
                var customers = await _context.Customers.ToListAsync();
                if (customers == null)
                {
                    return NotFound("No customer data");
                }
                return customers;
            }
            catch (Exception ex) {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> AsyncGetCustomer(int? id)
        {
                if (id == null)
                {
                    return NotFound("id doesn't contain value");
                }

            try {
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
            catch (Exception ex) {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
            
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> AsyncPutCustomer(int? id, CreateCustomerRequest customerReq)
        {
               if (id == null)
                {
                    return NotFound("id doesn't contain value");
                }

            try {
                if (customerReq == null)
                {
                    return NotFound("Your request is null or invalid");
                }

                if (id != customerReq.Id)
                {
                    return NotFound("No customer data for this id");
                }
            
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
        public async Task<ActionResult<Customer>> AsyncPostCustomer(CreateCustomerRequest customerReq)
        {
            try
            {
                if (customerReq == null)
                {
                    return NotFound("Your request is null or invalid");
                }

                if (_context.Customers == null)
                {
                    return Problem("Entity set 'OnboardingTaskDbContext.Customers' is null.");
                }
            
                var customer = new Customer() { Name = customerReq.Name, Address = customerReq.Address };
                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();
                return CreatedAtAction("AsyncGetCustomer", new { id = customer.Id }, customer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }

        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> AsyncDeleteCustomer(int? id)
        {
            if (id == null)
            {
                return NotFound("id doesn't contain value");
            }

            try {
                if (_context.Customers == null)
                {
                    return NotFound("Entity set 'OnboardingTaskDbContext.Customers' is null.");
                }

                var customer = await _context.Customers.FindAsync(id);
                if (customer == null)
                {
                    return NotFound("No customer data for this id");
                }

                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        private bool CustomerExists(int? id)
        {
            return (_context.Customers?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
