using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Onboarding_Task.Models;
using Onboarding_Task.ResponseViewModels;
using Onboarding_Task.ViewModels;

namespace Onboarding_Task.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController: ControllerBase
    {
        private readonly OnboardingTaskDbContext _context;

        public SalesController(OnboardingTaskDbContext context)
        {
            _context=context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SalesResponse>>> AsyncGetSales()
        {
            try {
                if (_context.Sales == null)
                {
                    return NotFound("No sale data");
                }

                var sales = await _context.Sales
                    .Include(s => s.Customer)
                    .Include(s => s.Product)
                    .Include(s => s.Store)
                    .Select(x => new SalesResponse()
                    {
                        CustomerId = x.CustomerId,
                        CustomerName = x.Customer.Name,
                        ProductId = x.ProductId,
                        DateSold = x.DateSold,
                        Id = x.Id,
                        ProductName = x.Product.Name,
                        StoreId = x.StoreId,
                        StoreName = x.Store.Name,
                    }).ToListAsync();

                return sales;
                }
            catch (Exception ex) {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SalesResponse>> AsyncGetSales(int? id)
        {
            if (id == null)
            {
                return NotFound("id doesn't contain value");
            }

            try {
                if (_context.Sales == null)
                {
                    return NotFound("No sale data");
                }

                var salesEntity = await _context.Sales
                    .Include(s => s.Customer)
                    .Include(s => s.Product)
                    .Include(s => s.Store)
                    .Where(x => x.Id == id).FirstOrDefaultAsync();

                if (salesEntity is null)
                    return NotFound("Entity set 'OnboardingTaskDbContext.Sales' is null.");

                var sales = new SalesResponse()
                {
                    Id = salesEntity.Id,
                    CustomerId = salesEntity.CustomerId,
                    CustomerName = salesEntity.Customer.Name,
                    ProductId = salesEntity.ProductId,
                    ProductName = salesEntity.Product.Name,
                    StoreId = salesEntity.StoreId,
                    StoreName = salesEntity.Store.Name,
                    DateSold = salesEntity.DateSold,   
                };

                return sales;
                }
            catch (Exception ex) {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> AsyncPutSales(int? id, CreateSalesRequest salesReq)
        {
            if (id == null)
            {
                return NotFound("id doesn't contain value");
            }

            try {
                if (salesReq == null)
                {
                    return NotFound("Your request is null or invalid");
                }

                if (id != salesReq.Id)
                {
                    return BadRequest();
                }
            
                _context.Entry(new Sales()
                {
                    Id = salesReq.Id,
                    StoreId = salesReq.StoreId,
                    ProductId = salesReq.ProductId,
                    DateSold = salesReq.DateSold,
                    CustomerId = salesReq.CustomerId
                }).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SalesExists(id))
                {
                    return NotFound("No sale data for this id");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Sales>> AsyncPostSales(CreateSalesRequest salesReq)
        {
            try {
                if (salesReq == null)
                {
                    return NotFound("Your request is null or invalid");
                }

                if (_context.Sales == null)
                {
                    return Problem("Entity set 'OnboardingTaskDbContext.Sales' is null.");
                }
             
                var sales = new Sales()
                {
                    StoreId = salesReq.StoreId,
                    ProductId = salesReq.ProductId,
                    DateSold = salesReq.DateSold,
                    CustomerId = salesReq.CustomerId
                };

                _context.Sales.Add(sales);
                await _context.SaveChangesAsync();

                return CreatedAtAction("AsyncGetSales", new { id = sales.Id }, sales);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> AsyncDeleteSales(int? id)
        {
            if (id == null)
            {
                return NotFound("id doesn't contain value");
            }

            try {
                if (_context.Sales == null)
                {
                    return NotFound();
                }
                var sales = await _context.Sales.FindAsync(id);

                if (sales == null)
                {
                    return NotFound();
                }
            
                _context.Sales.Remove(sales);
                await _context.SaveChangesAsync();

                return NoContent();
            }

            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        private bool SalesExists(int? id)
        {
            return (_context.Sales?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
