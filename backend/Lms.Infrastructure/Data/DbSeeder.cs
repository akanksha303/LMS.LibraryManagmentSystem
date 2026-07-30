using Lms.Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Lms.Infrastructure.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(LmsDbContext context, UserManager<User> userManager, RoleManager<IdentityRole<Guid>> roleManager)
        {
            // Apply migrations dynamically
            await context.Database.EnsureCreatedAsync();

            // Seed Roles
            var roles = new[] { "Admin", "Librarian", "Student" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole<Guid>(role));
                }
            }

            // Seed Users
            var adminEmail = "admin@lms.com";
            var librarianEmail = "librarian@lms.com";
            var studentEmail = "student@lms.com";

            User? adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                adminUser = new User
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    Name = "Admin User",
                    PhoneNumber = "+1234567890",
                    Department = "Administration",
                    Status = "Active",
                    MembershipDate = DateTime.UtcNow.AddMonths(-6)
                };
                await userManager.CreateAsync(adminUser, "Admin123!");
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }

            User? librarianUser = await userManager.FindByEmailAsync(librarianEmail);
            if (librarianUser == null)
            {
                librarianUser = new User
                {
                    UserName = librarianEmail,
                    Email = librarianEmail,
                    Name = "Librarian Joe",
                    PhoneNumber = "+1987654321",
                    Department = "Library Science",
                    Status = "Active",
                    MembershipDate = DateTime.UtcNow.AddMonths(-3)
                };
                await userManager.CreateAsync(librarianUser, "Librarian123!");
                await userManager.AddToRoleAsync(librarianUser, "Librarian");
            }

            User? studentUser = await userManager.FindByEmailAsync(studentEmail);
            if (studentUser == null)
            {
                studentUser = new User
                {
                    UserName = studentEmail,
                    Email = studentEmail,
                    Name = "Akanksha",
                    PhoneNumber = "+15550199",
                    Department = "Computer Science",
                    Status = "Active",
                    MembershipDate = DateTime.UtcNow.AddMonths(-1)
                };
                await userManager.CreateAsync(studentUser, "Student123!");
                await userManager.AddToRoleAsync(studentUser, "Student");
            }
            else
            {
                studentUser.Name = "Akanksha";
                await userManager.UpdateAsync(studentUser);
            }

            // Seed Books
            var booksToSeed = new List<Book>
            {
                new Book
                {
                    ISBN = "9780134685991",
                    Title = "Effective Java",
                    Author = "Joshua Bloch",
                    Publisher = "Addison-Wesley",
                    Category = "Programming",
                    Edition = "3rd Edition",
                    Language = "English",
                    TotalCopies = 10,
                    AvailableCopies = 9,
                    RackLocation = "A-32",
                    CoverImage = "https://covers.openlibrary.org/b/isbn/9780134685991-M.jpg"
                },
                new Book
                {
                    ISBN = "9780132350884",
                    Title = "Clean Code",
                    Author = "Robert C. Martin",
                    Publisher = "Prentice Hall",
                    Category = "Programming",
                    Edition = "1st Edition",
                    Language = "English",
                    TotalCopies = 8,
                    AvailableCopies = 7,
                    RackLocation = "A-33",
                    CoverImage = "https://covers.openlibrary.org/b/isbn/9780132350884-M.jpg"
                },
                new Book
                {
                    ISBN = "9780441172719",
                    Title = "Dune",
                    Author = "Frank Herbert",
                    Publisher = "Chilton Books",
                    Category = "Sci-Fi",
                    Edition = "Classic Edition",
                    Language = "English",
                    TotalCopies = 5,
                    AvailableCopies = 4,
                    RackLocation = "B-12",
                    CoverImage = "https://covers.openlibrary.org/b/isbn/9780441172719-M.jpg"
                },
                new Book
                {
                    ISBN = "9780062316097",
                    Title = "Sapiens: A Brief History of Humankind",
                    Author = "Yuval Noah Harari",
                    Publisher = "Harper",
                    Category = "History",
                    Edition = "1st Edition",
                    Language = "English",
                    TotalCopies = 6,
                    AvailableCopies = 5,
                    RackLocation = "C-05",
                    CoverImage = "https://covers.openlibrary.org/b/isbn/9780062316097-M.jpg"
                },
                new Book
                {
                    ISBN = "9780593157022",
                    Title = "The Hobbit",
                    Author = "J.R.R. Tolkien",
                    Publisher = "George Allen & Unwin",
                    Category = "Fantasy",
                    Edition = "75th Anniversary",
                    Language = "English",
                    TotalCopies = 7,
                    AvailableCopies = 7,
                    RackLocation = "B-15",
                    CoverImage = "https://covers.openlibrary.org/b/isbn/9780593157022-M.jpg"
                }
            };

            foreach (var b in booksToSeed)
            {
                var existing = await context.Books.FirstOrDefaultAsync(x => x.ISBN == b.ISBN);
                if (existing == null)
                {
                    b.Id = Guid.NewGuid();
                    await context.Books.AddAsync(b);
                }
                else
                {
                    existing.CoverImage = b.CoverImage; // Update cover URL
                }
            }
            await context.SaveChangesAsync();

            // Seed some Borrowing Transactions if none exist
            if (!await context.BorrowingTransactions.AnyAsync())
            {
                var effectiveJava = await context.Books.FirstAsync(x => x.ISBN == "9780134685991");
                var cleanCode = await context.Books.FirstAsync(x => x.ISBN == "9780132350884");
                var dune = await context.Books.FirstAsync(x => x.ISBN == "9780441172719");
                var sapiens = await context.Books.FirstAsync(x => x.ISBN == "9780062316097");

                var transaction1 = new BorrowingTransaction
                {
                    Id = Guid.NewGuid(),
                    UserId = studentUser.Id,
                    BookId = effectiveJava.Id,
                    IssueDate = DateTime.UtcNow.AddDays(-10),
                    DueDate = DateTime.UtcNow.AddDays(4),
                    Status = "Issued"
                };

                var transaction2 = new BorrowingTransaction
                {
                    Id = Guid.NewGuid(),
                    UserId = studentUser.Id,
                    BookId = cleanCode.Id,
                    IssueDate = DateTime.UtcNow.AddDays(-20),
                    DueDate = DateTime.UtcNow.AddDays(-6),
                    Status = "Issued" // Late/Overdue (should trigger fine later)
                };

                var transaction3 = new BorrowingTransaction
                {
                    Id = Guid.NewGuid(),
                    UserId = studentUser.Id,
                    BookId = dune.Id,
                    IssueDate = DateTime.UtcNow.AddDays(-2),
                    DueDate = DateTime.UtcNow.AddDays(12),
                    Status = "Issued"
                };

                // Seed a completed transaction that had a fine paid
                var transaction4 = new BorrowingTransaction
                {
                    Id = Guid.NewGuid(),
                    UserId = studentUser.Id,
                    BookId = sapiens.Id,
                    IssueDate = DateTime.UtcNow.AddDays(-30),
                    DueDate = DateTime.UtcNow.AddDays(-16),
                    ReturnDate = DateTime.UtcNow.AddDays(-10),
                    Status = "Returned"
                };

                await context.BorrowingTransactions.AddRangeAsync(transaction1, transaction2, transaction3, transaction4);
                await context.SaveChangesAsync();

                // Seed fine for transaction 4
                var fine = new Fine
                {
                    Id = Guid.NewGuid(),
                    TransactionId = transaction4.Id,
                    Amount = 6.00m, // 6 days late * $1
                    IsPaid = true,
                    CreatedDate = DateTime.UtcNow.AddDays(-10)
                };

                await context.Fines.AddAsync(fine);
                await context.SaveChangesAsync();
            }
        }
    }
}
