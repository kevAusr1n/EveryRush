using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EveryRush.Migrations
{
    /// <inheritdoc />
    public partial class ChangeTable4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ProductName",
                table: "PurchaseProducts",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "ProductImageUrl",
                table: "PurchaseProducts",
                newName: "ImageUrl");

            migrationBuilder.RenameColumn(
                name: "ProductDescription",
                table: "PurchaseProducts",
                newName: "Description");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "PurchaseProducts",
                newName: "ProductName");

            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                table: "PurchaseProducts",
                newName: "ProductImageUrl");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "PurchaseProducts",
                newName: "ProductDescription");
        }
    }
}
