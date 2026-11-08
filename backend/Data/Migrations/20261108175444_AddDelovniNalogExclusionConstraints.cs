using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StrojniNalog.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDelovniNalogExclusionConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
        CREATE EXTENSION IF NOT EXISTS btree_gist;

        ALTER TABLE "DelovniNalogi"
        ADD CONSTRAINT "EX_DelovniNalogi_StrojTermin"
        EXCLUDE USING gist (
            "StrojId" WITH =,
            tstzrange("PredvideniZacetek", "PredvideniKonec", '[)') WITH &&
        );

        ALTER TABLE "DelovniNalogi"
        ADD CONSTRAINT "EX_DelovniNalogi_IzvajalecTermin"
        EXCLUDE USING gist (
            "IzvajalecId" WITH =,
            tstzrange("PredvideniZacetek", "PredvideniKonec", '[)') WITH &&
        );
        """);
        }

        /*
        btree_gist omogoči primerjavo številskih ID-jev znotraj indeksa GiST.
        WITH = preverja isti stroj oziroma izvajalca.
        WITH && preverja prekrivanje intervalov.
        '[)' vključuje začetek in izključuje konec, zato so zaporedni termini dovoljeni.
        */

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
        ALTER TABLE "DelovniNalogi"
        DROP CONSTRAINT "EX_DelovniNalogi_IzvajalecTermin";

        ALTER TABLE "DelovniNalogi"
        DROP CONSTRAINT "EX_DelovniNalogi_StrojTermin";
        """);
        }
    }
}
