using Lms.Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Lms.Infrastructure.Data
{
    public class LmsDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
    {
        public LmsDbContext(DbContextOptions<LmsDbContext> options) : base(options)
        {
        }

        public DbSet<Book> Books { get; set; } = null!;
        public DbSet<BorrowingTransaction> BorrowingTransactions { get; set; } = null!;
        public DbSet<Fine> Fines { get; set; } = null!;
        public DbSet<Reservation> Reservations { get; set; } = null!;
        public DbSet<Review> Reviews { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Rename Identity Tables (Clean standard look)
            builder.Entity<User>().ToTable("Users");
            builder.Entity<IdentityRole<Guid>>().ToTable("Roles");
            builder.Entity<IdentityUserRole<Guid>>().ToTable("UserRoles");
            builder.Entity<IdentityUserClaim<Guid>>().ToTable("UserClaims");
            builder.Entity<IdentityUserLogin<Guid>>().ToTable("UserLogins");
            builder.Entity<IdentityRoleClaim<Guid>>().ToTable("RoleClaims");
            builder.Entity<IdentityUserToken<Guid>>().ToTable("UserTokens");

            // Book configuration
            builder.Entity<Book>(b =>
            {
                b.HasKey(x => x.Id);
                b.Property(x => x.ISBN).IsRequired().HasMaxLength(20);
                b.Property(x => x.Title).IsRequired().HasMaxLength(250);
                b.Property(x => x.Author).IsRequired().HasMaxLength(150);
                b.Property(x => x.Publisher).HasMaxLength(150);
                b.Property(x => x.Category).HasMaxLength(100);
                b.Property(x => x.Edition).HasMaxLength(50);
                b.Property(x => x.Language).HasMaxLength(50);
                b.Property(x => x.RackLocation).HasMaxLength(50);
                b.HasIndex(x => x.ISBN).IsUnique();
                b.HasIndex(x => x.Title);
            });

            // BorrowingTransaction configuration
            builder.Entity<BorrowingTransaction>(bt =>
            {
                bt.HasKey(x => x.Id);
                bt.Property(x => x.Status).IsRequired().HasMaxLength(50);

                bt.HasOne(x => x.User)
                  .WithMany(u => u.BorrowingTransactions)
                  .HasForeignKey(x => x.UserId)
                  .OnDelete(DeleteBehavior.Restrict); // Prevent user deletion from failing silently or wiping data

                bt.HasOne(x => x.Book)
                  .WithMany(b => b.BorrowingTransactions)
                  .HasForeignKey(x => x.BookId)
                  .OnDelete(DeleteBehavior.Restrict);
            });

            // Fine configuration (1-to-1 relationship with BorrowingTransaction)
            builder.Entity<Fine>(f =>
            {
                f.HasKey(x => x.Id);
                f.Property(x => x.Amount).HasColumnType("decimal(18,2)");

                f.HasOne(x => x.BorrowingTransaction)
                  .WithOne(t => t.Fine)
                  .HasForeignKey<Fine>(x => x.TransactionId)
                  .OnDelete(DeleteBehavior.Cascade);
            });

            // Reservation configuration
            builder.Entity<Reservation>(r =>
            {
                r.HasKey(x => x.Id);
                r.Property(x => x.Status).IsRequired().HasMaxLength(50);

                r.HasOne(x => x.User)
                  .WithMany(u => u.Reservations)
                  .HasForeignKey(x => x.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

                r.HasOne(x => x.Book)
                  .WithMany(b => b.Reservations)
                  .HasForeignKey(x => x.BookId)
                  .OnDelete(DeleteBehavior.Cascade);
            });

            // Review configuration
            builder.Entity<Review>(re =>
            {
                re.HasKey(x => x.Id);
                re.Property(x => x.Comment).HasMaxLength(1000);

                re.HasOne(x => x.User)
                  .WithMany(u => u.Reviews)
                  .HasForeignKey(x => x.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

                re.HasOne(x => x.Book)
                  .WithMany(b => b.Reviews)
                  .HasForeignKey(x => x.BookId)
                  .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
