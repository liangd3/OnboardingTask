using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Onboarding_Task.Models;
using Onboarding_Task.ViewModels;

namespace Onboarding_Task.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ProductController: ControllerBase
    {
        private readonly OnboardingTaskDbContext _context;

        public ProductController(OnboardingTaskDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            var products = await _context.Products.ToListAsync();
            if (products == null)
            {
                return NotFound("No product data");
            }
            return products;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            if (_context.Products == null)
            {
                return NotFound();
            }
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound("No product data for this id");
            }

            return product;
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, CreateProductRequest productReq)
        {
            if (productReq == null)
            {
                return NotFound("Your request is null or invalid");
            }

            if (id != productReq.Id)
            {
                return NotFound("No product data for this id");
            }

            try
            {
                _context.Entry(new Product()
                {
                    Id = productReq.Id,
                    Name = productReq.Name,
                    Price = productReq.Price
                }).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound("No product data for this id");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(CreateProductRequest productReq)
        {
            if (productReq == null)
            {
                return NotFound("Your request is null or invalid");
            }

            if (_context.Products == null)
            {
                return Problem("Entity set 'OnboardingTaskDbContext.Products' is null.");
            }

            try
            {
                var product = new Product()
                {
                    Name = productReq.Name,
                    Price = productReq.Price
                };
                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetProduct", new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            if (_context.Products == null)
            {
                return NotFound("Entity set 'OnboardingTaskDbContext.Customers' is null.");
            }

            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound("No product data for this id");
            }

            try 
            { 
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        private bool ProductExists(int id)
        {
            return (_context.Products?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
